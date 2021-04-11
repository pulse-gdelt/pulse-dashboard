import React, { useEffect, useState } from "react";
import { ScatterPlot, data } from "../../components/ScatterPlot";
import { getDomain } from "tldjs";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faQuoteLeft, faBook } from "@fortawesome/free-solid-svg-icons";
import { faAngry, faSmileBeam, faMehBlank } from "@fortawesome/free-regular-svg-icons";

// export function scatterPlotMouseOverHandler(event: any, datapoint: any): void {
//   console.log(datapoint)
// }

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

export function Dashboard(): JSX.Element {
  const [mouseoverDataPoint, scatterPlotMouseOverHandler] = useState({});

  return (
    <>
      <div className="flex flex-col my-1 px-1 w-1/5">
        <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Average Tone</h3>
        </div>

        <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Tone Distribution</h3>
        </div>
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
    const { DocTone, Title, URL, datetime, ContextualText, Location, topic } = data.datapoint;
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
          {
            topic.split("_").slice(1).map((topicKeyword: string) => 
            (<span className="inline-flex items-center px-2.5 py-0.5 mx-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              {topicKeyword}
            </span>)
            )
          }
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
      <ul>
        {pane}
      </ul>
    </div>
  );
}
