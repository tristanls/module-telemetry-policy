"use strict";

const Rx = require("rxjs");
const { filter } = require("rxjs/operators");

const countdown = (done, count) =>
{
    let doneCount = 0;
    return () =>
    {
        doneCount++;
        if (doneCount == count)
        {
            done();
        }
    }
};

const observable =
{
    fromTelemetry: module => Rx.Observable.create(observer =>
        {
            module.on("telemetry", event => observer.next(event));
            module.on("end", _ => observer.complete());
        }
    )
};

module.exports = config =>
{
    it(`exposes "name" and "version" properties`, () =>
        {
            const module = config.construct();
            expect(module.name).toBe(config.package.name);
            expect(module.version).toBe(config.package.version);
        }
    );

    it("configures self as telemetry emitter", done =>
        {
            const module = config.construct();
            const finish = countdown(done, 2);
            observable.fromTelemetry(module).pipe(
                filter(event => event.msg)
            )
            .subscribe(
                event =>
                {
                    expect(event.msg).toBe("hi o/");
                    finish()
                },
                error => expect(error).toBe(false),
                finish
            );
            module.emit("telemetry", { msg: "hi o/" });
            setImmediate(() => module.emit("end"));
        }
    );

    it("configures telemetry logging", done =>
        {
            const module = config.construct();
            const finish = countdown(done, 2);
            observable.fromTelemetry(module).pipe(
                filter(event => event.type == "log"),
                filter(event => event.level == "info")
            )
            .subscribe(
                event =>
                {
                    expect(event.message).toBe("hi o/");
                    finish()
                },
                error => expect(error).toBe(false),
                finish
            );
            module._log("info", "hi o/");
            setImmediate(() => module.emit("end"));
        }
    );

    it("configures telemetry metrics", done =>
        {
            const module = config.construct();
            const finish = countdown(done, 2);
            observable.fromTelemetry(module).pipe(
                filter(event => event.type == "metric")
            )
            .subscribe(
                event =>
                {
                    expect(event.name).toBe("latency");
                    expect(event.target_type).toBe("gauge");
                    expect(event.unit).toBe("ms");
                    expect(event.value).toBe(100);
                    finish();
                },
                error => expect(error).toBe(false),
                finish
            );
            module._metrics.gauge("latency",
                {
                    unit: "ms",
                    value: 100
                }
            );
            setImmediate(() => module.emit("end"));
        }
    );

    it("configures telemetry tracing", done =>
        {
            const module = config.construct();
            const finish = countdown(done, 2);
            const parentSpan = module._tracing.trace("test", undefined,
                {
                    my: "baggage"
                }
            );
            observable.fromTelemetry(module).pipe(
                filter(event => event.type == "trace")
            )
            .subscribe(
                event =>
                {
                    expect(event.name).toBe("test");
                    expect(event.traceId).toBe(parentSpan._traceId);
                    expect(event.baggage).toEqual(
                        {
                            my: "baggage"
                        }
                    );
                    finish();
                },
                error => expect(error).toBe(false),
                finish
            );
            parentSpan.finish();
            setImmediate(() => module.emit("end"));
        }
    );
};
