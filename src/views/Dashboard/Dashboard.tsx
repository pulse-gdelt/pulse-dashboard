import React, { useEffect, useState } from "react";
import { ScatterPlot, data } from "../../components/ScatterPlot";
import { ToneHistogram } from "../../components/ToneHistogram";
import { getDomain } from "tldjs";
import "./Dashboard.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExternalLinkAlt, faQuoteLeft, faBook } from "@fortawesome/free-solid-svg-icons";
import { faAngry, faSmileBeam, faMehBlank } from "@fortawesome/free-regular-svg-icons";
import { SearchIcon } from "@heroicons/react/solid";
import { useDebounce } from "use-debounce";

export function Spinner(): JSX.Element {
  return <div className="m-auto loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>;
}

export default function Example({ setTextHandler }: { setTextHandler: any }) {
  const [text, setText] = useState("Hello");
  const [value] = useDebounce(text, 1000);
  useEffect(() => {
      console.log("debounced, setting text");
      setTextHandler(value);
  }, [value]);

  return (
    <div className="flex py-4">
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          name="search-query"
          id="search-query"
          className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
          placeholder="words to search for"
          onChange={(e) => {
            setText(e.target.value);
          }}
        />
      </div>
    </div>
  );
}

export function CenterPane({
  plotData,
  scatterPlotMouseOverHandler,
  searchFieldHandler,
}: {
  plotData: any;
  scatterPlotMouseOverHandler: any;
  searchFieldHandler: any;
}): JSX.Element {
  return (
    <>
      <div className="my-1 -mx-1 h-full bg-white shadow rounded-lg">
        <div className="px-4 py-5 h-full w-full flex flex-col content-around">
          <Example setTextHandler={searchFieldHandler} />
          {plotData.hits ? (
            <ScatterPlot dataParam={plotData.hits.hits} mouseoverHandler={scatterPlotMouseOverHandler} />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
}

export function AverageTone({ plotData, startDate, endDate }: { plotData: any, startDate: Date; endDate: Date }): JSX.Element {
  const averageToneScore = plotData?.aggregations ? parseFloat(plotData.aggregations.averageTone.value) : 0;
  const green = "text-green-600";
  const red = "text-red-600";
  const textClassName = `text-7xl -ml-5 ${averageToneScore >= 0 ? green : red}`;
  return (
    <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Average Tone</h3>
      <div className="flex flex-col items-center content-center justify-center h-full">
        <div className="flex">
          <p className={textClassName}>{averageToneScore.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
}

export function ToneHistogramPane({plotData, startDate, endDate }: { plotData: any, startDate: Date; endDate: Date }): JSX.Element {
  return (
    <div className="flex flex-col m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Tone Distribution</h3>
      {plotData?.hits ? <ToneHistogram dataParam={plotData} mouseoverHandler={() => {}} /> : null}
    </div>
  );
}

export function Dashboard(): JSX.Element {
  const [mouseoverDataPoint, scatterPlotMouseOverHandler] = useState({});
  const [dates, setDates] = useState({
    startDate: new Date("2021-03-11T00:00:00.000Z"),
    endDate: new Date("2021-03-14T00:00:00.000Z"),
  });

  const [queryText, setQueryText] = useState(undefined);

  useEffect(() => {
    if (queryText) {
      console.log(`sending query for ${queryText}`);
      setEsResults({})
    }
  }, [queryText]);
  
  const [elasticsearchResults, setEsResults] = useState({} as any);
  useEffect(() => {
    const executeElasticsearchCall = async () => {
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
              must:[ 
                queryText ? {
                  match: {
                    ContextualText: queryText,
                  },
                } : null,
                {
                range: {
                  DateTime: {
                    gte: dates.startDate,
                    lte: dates.endDate,
                  },
                },
              }],
            },
          },
          aggs: {
            averageTone: {
              avg: {
                field: "DocTone",
              },
            },
            doctone_distribution: {
              histogram: {
                field: "DocTone",
                interval: 1,
                keyed: true,
              },
            },
          },
          _source: ["DocTone", "Title", "URL", "topic", "ContextualText", "Location", "DateTime"],
        }),
      } as any);
      console.timeEnd("data-fetch");
      setEsResults(await res.json());
    };
    if (elasticsearchResults) {
      console.log(elasticsearchResults);
    }
    executeElasticsearchCall();
  }, [dates, queryText]);

  useEffect(() => {
    console.log("received search results", elasticsearchResults);
  }, elasticsearchResults);

  return (
    <>
      <div className="flex flex-col my-1 px-1 w-1/5">
        <AverageTone plotData={elasticsearchResults} startDate={dates.startDate} endDate={dates.endDate} />

        <ToneHistogramPane plotData={elasticsearchResults} startDate={dates.startDate} endDate={dates.endDate} />

        <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Trending</h3>
        </div>
      </div>

      <div className="flex flex-col my-1 px-1 w-3/5">
        <CenterPane
          plotData={elasticsearchResults}
          searchFieldHandler={setQueryText}
          scatterPlotMouseOverHandler={scatterPlotMouseOverHandler}
        />
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
