import React, { useEffect, useState } from "react";
import { ScatterPlot, data } from "../../components/ScatterPlot";
import { ToneHistogram } from "../../components/ToneHistogram";
import { getDomain } from "tldjs";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faQuoteLeft, faBook } from "@fortawesome/free-solid-svg-icons";
import { faAngry, faSmileBeam, faMehBlank } from "@fortawesome/free-regular-svg-icons";
import { min } from "d3-array";

export function Spinner(): JSX.Element {
  return <div className="m-auto loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>;
}

export function CenterPane({ scatterPlotMouseOverHandler }: { scatterPlotMouseOverHandler: any }): JSX.Element {
  const [ss, setSs] = useState({} as any);
  useEffect(() => {
    const f = async () => {
      console.log("sending query...");
      console.time("data-fetch");
      const res = await fetch("https://walter-insurance-peter-generators.trycloudflare.com/index3/_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          size: 10000,
          query: {
            bool: {
              must: {
                range: {
                  DateTime: {
                    gte: "2021-03-12T00:00:00.000Z",
                    lte: "2021-03-13T00:00:00.000Z",
                  },
                },
              },
            },
          },
          _source: ["DocTone", "Title", "URL", "topic", "ContextualText", "Location", "DateTime"],
        }),
      } as any);
      console.timeEnd("data-fetch");
      setSs(await res.json());
    };
    if (ss) {
      console.log(ss);
    }
    f();
  }, []);

  useEffect(() => {
    console.log("newdata", ss);
  }, [ss]);

  return (
    <>
      <div className="my-1 -mx-1 h-full bg-white shadow rounded-lg">
        <div className="px-4 py-5 h-full w-full flex content-around">
          {ss.hits ? (
            <ScatterPlot dataParam={ss.hits.hits} mouseoverHandler={scatterPlotMouseOverHandler} />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
}

export function AverageTone({ startDate, endDate }: { startDate: Date; endDate: Date }): JSX.Element {
  const [ss, setSs] = useState(0 as any);
  useEffect(() => {
    const f = async () => {
      console.log(`sending query... ${startDate}, ${endDate}`);
      console.time("data-fetch");
      const res = await fetch("https://walter-insurance-peter-generators.trycloudflare.com/index3/_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            bool: {
              must: {
                range: {
                  DateTime: {
                    gte: startDate.toJSON(),
                    lte: endDate.toJSON(),
                  },
                },
              },
            },
          },
          aggs: {
            averageTone: {
              avg: {
                field: "DocTone",
              },
            },
          },
        }),
      } as any);
      console.timeEnd("data-fetch");
      setSs(parseFloat((await res.json()).aggregations.averageTone.value).toFixed(2));
    };
    if (ss) {
      console.log(ss);
    }
    f();
  }, []);
  useEffect(() => {
    console.log("avg tone data", ss);
  }, [ss]);
  const green = "text-green-600"
  const red = "text-red-600"
  const textClassName = `text-7xl -ml-5 ${ss >= 0 ? green : red }`
  return (
    <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Average Tone</h3>
      <div className="flex flex-col items-center content-center justify-center h-full">
        <div className="flex">
          <p className={textClassName}>{ss}</p>
        </div>
      </div>
    </div>
  );
}

export function ToneHistogramPane({ startDate, endDate }: { startDate: Date; endDate: Date }): JSX.Element {
  const [ss, setSs] = useState({} as any);
  useEffect(() => {
    const f = async () => {
      console.log("sending query...");
      console.time("data-fetch");
      const res = await fetch("https://walter-insurance-peter-generators.trycloudflare.com/index3/_search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            bool: {
              must: {
                range: {
                  DateTime: {
                    gte: startDate.toJSON(),
                    lte: endDate.toJSON(),
                  },
                },
              },
            },
          },
          aggs: {
            doctone_distribution: {
              histogram: {
                field: "DocTone",
                interval: 1,
                keyed: true,
              },
            },
          },
        }),
      } as any);
      console.timeEnd("data-fetch");
      setSs(await res.json());
    };
    if (ss) {
      console.log(ss);
    }
    f();
  }, []);

  useEffect(() => {
    console.log("histogram data", ss);
  }, [ss]);

  return (
    <div className="flex flex-col m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Tone Distribution</h3>
      {ss.hits ? <ToneHistogram dataParam={ss} mouseoverHandler={() => {}} /> : null }
    </div>
  );
}

export function Dashboard(): JSX.Element {
  const [mouseoverDataPoint, scatterPlotMouseOverHandler] = useState({});
  const [dates, setDates] = useState({
    startDate: new Date("2021-03-11T00:00:00.000Z"),
    endDate: new Date("2021-03-14T00:00:00.000Z"),
  });

  return (
    <>
      <div className="flex flex-col my-1 px-1 w-1/5">
        <AverageTone startDate={dates.startDate} endDate={dates.endDate} />

        <ToneHistogramPane startDate={dates.startDate} endDate={dates.endDate} />

        <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Trending</h3>
        </div>
      </div>

      <div className="flex flex-col my-1 px-1 w-3/5">
        <CenterPane scatterPlotMouseOverHandler={scatterPlotMouseOverHandler} />
      </div>

      <div className="flex flex-col my-1 px-1 w-1/5 overflow-hidden">
        <Articles data={mouseoverDataPoint} />
      </div>
    </>
  );
}
export function Articles({ data }: { data: any }): JSX.Element {
  console.log("article data", data);
  let pane = null;
  if (data?.datapoint) {
    const { DocTone, Title, URL, DateTime, ContextualText, Location, topic } = data.datapoint;
    pane = (
      <>
        <li className="my-3">
          <h3 className="text-lg font-semibold">
            <a target="_blank" href={URL}>
              {Title}
            </a>
          </h3>
        </li>
        <li className="py-1">
          <FontAwesomeIcon icon={faExternalLinkAlt} className="mx-2" />
          <a className="text-blue-700 italic font-bold" target="_blank" href={URL}>
            {getDomain(URL)}
          </a>
        </li>
        <li className="my-3">
          {DocTone > 2 ? <FontAwesomeIcon className="mx-2" icon={faSmileBeam} /> : null}
          {DocTone < -2 ? <FontAwesomeIcon className="mx-2" icon={faAngry} /> : null}
          {DocTone >= -2 && DocTone <= 2 ? <FontAwesomeIcon className="mx-2" icon={faMehBlank} /> : null}
          {DocTone.toFixed(2)}
        </li>
        <li className="my-3">
          <FontAwesomeIcon className="mx-2" icon={faBook} />
          {topic
            .split("_")
            .slice(1)
            .map((topicKeyword: string) => (
              <span className="inline-flex items-center px-2.5 py-0.5 mx-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {topicKeyword}
              </span>
            ))}
        </li>
        <li>
          <FontAwesomeIcon className="mx-2" icon={faQuoteLeft} />
          <p className="mx-2">{ContextualText}</p>
        </li>
      </>
    );
  }
  return (
    <div className="m-1 h-full shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6 overflow-hidden">
      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">News Event Information</h3>
      <ul>{pane ?? <p className="text-3xl text-gray-400 italic">Mouseover something!</p>}</ul>
    </div>
  );
}
