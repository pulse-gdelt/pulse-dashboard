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
import lodash from "lodash";
import { DateTime } from "luxon";
import DayPickerInput from "react-day-picker/DayPickerInput";
import "react-day-picker/lib/style.css";

const ES_ENDPOINT = "https://walter-insurance-peter-generators.trycloudflare.com/";

export function Spinner(): JSX.Element {
  return <div className="m-auto loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-64 w-64"></div>;
}

export function SearchField({
  setTextHandler,
  dates,
  datesHandler,
}: {
  dates: any;
  datesHandler: any;
  setTextHandler: any;
}) {
  const [text, setText] = useState(undefined! as string);
  const [value] = useDebounce(text, 1000);
  useEffect(() => {
    console.log("debounced, setting text");
    setTextHandler(value);
  }, [value]);

  const handleDateSelect = (newDate: any) => {
    const newStartDate = DateTime.fromJSDate(newDate);
    const newEndDate = newStartDate.plus({ day: 1 });
    datesHandler({ startDate: newStartDate.toUTC().toJSDate(), endDate: newEndDate.toUTC().toJSDate() });
  };
  return (
    <div className="flex flex-row py-4">
      <div className="mt-1 flex relative rounded-md shadow-sm">
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
      <div className="fiex">
        <DayPickerInput
          value={dates.startDate}
          dayPickerProps={{ selectedDays: dates.startDate }}
          onDayChange={handleDateSelect}
        ></DayPickerInput>
      </div>
    </div>
  );
}

export function CenterPane({
  plotData,
  dates,
  scatterPlotMouseOverHandler,
  searchFieldHandler,
  topicSelectionHandler,
  externalTopic,
  datesHandler,
}: {
  plotData: any;
  dates: any;
  scatterPlotMouseOverHandler: any;
  searchFieldHandler: any;
  topicSelectionHandler: any;
  externalTopic: any;
  datesHandler: any;
}): JSX.Element {
  return (
    <>
      <div className="my-1 -mx-1 h-full bg-white shadow rounded-lg">
        <div className="px-4 py-5 h-full w-full flex flex-col content-around">
          <SearchField dates={dates} datesHandler={datesHandler} setTextHandler={searchFieldHandler} />
          {plotData.hits ? (
            <ScatterPlot
              topicSelectionHandler={topicSelectionHandler}
              dataParam={plotData.hits.hits}
              mouseoverHandler={scatterPlotMouseOverHandler}
              externalTopic={externalTopic}
            />
          ) : (
            <Spinner />
          )}
        </div>
      </div>
    </>
  );
}

export function AverageTone({
  plotData,
  startDate,
  endDate,
  topicFilter,
}: {
  plotData: any;
  startDate: Date;
  endDate: Date;
  topicFilter: string | undefined;
}): JSX.Element {
  function average(nums: Array<number>) {
    return nums.reduce((a, b) => a + b) / nums.length;
  }
  console.log("pd hits", plotData);
  let averageToneScore, articleCount;
  averageToneScore = plotData?.aggregations ? parseFloat(plotData.aggregations.averageTone.value) : 0;
  articleCount = plotData?.hits?.hits?.length ?? 0;
  if (plotData.hits && topicFilter) {
    let selectedArticles = plotData.hits.hits
      // @ts-ignore
      .filter((d) => d._source.topic === topicFilter);
    averageToneScore = average(
      selectedArticles
        // @ts-ignore
        .map((d: { DocTone: any }) => d._source.DocTone)
    );
    articleCount = selectedArticles.length;
  }

  const green = "text-green-600";
  const red = "text-red-600";
  const textClassName = `text-center text-7xl -ml-1 ${averageToneScore >= 0 ? green : red}`;
  return (
    <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Average Tone {`(${articleCount} articles)`}</h3>
      <div className="flex flex-col items-center content-center justify-center h-full">
        <div className="flex flex-col items-center content-center justify-center">
          <p className={`${textClassName} flex`}>{averageToneScore.toFixed(2)}</p>
          {startDate ? (
            <p className="flex text-xl text-center pt-10">
              for news on {DateTime.fromJSDate(startDate).toLocaleString(DateTime.DATE_MED)}
            </p>
          ) : undefined}
        </div>
      </div>
    </div>
  );
}

export function ToneHistogramPane({
  plotData,
  startDate,
  endDate,
  topicFilter,
}: {
  plotData: any;
  startDate: Date;
  endDate: Date;
  topicFilter: string | undefined;
}): JSX.Element {
  return (
    <div className="flex flex-col m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Tone Distribution</h3>
      {plotData?.hits ? (
        <ToneHistogram topicFilter={topicFilter} dataParam={plotData} mouseoverHandler={() => {}} />
      ) : null}
    </div>
  );
}

export function Dashboard(): JSX.Element {
  const [mouseoverDataPoint, scatterPlotMouseOverHandler] = useState({});
  const [dates, setDates] = useState({
    startDate: undefined! as Date,
    endDate: undefined! as Date,
  });

  const [queryText, setQueryText] = useState(undefined);
  const [topicSelection, setTopicSelection] = useState(undefined);
  const [latestTrendingResults, setLatestTrendingResults] = useState({} as any);
  const [trendingTopicSelection, setTrendingTopicSelection] = useState(undefined! as string);

  useEffect(() => {
    const fetchLatestTrending = async () => {
      console.log("fetching latest trending");

      let matchers = [{ match_all: {} }] as any;
      if (dates.startDate) {
        matchers.push({
          range: {
            DateTime: {
              gte: dates.startDate,
              lt: dates.endDate,
            },
          },
        });
      }
      const res = await fetch(`${ES_ENDPOINT}trendingindex/_search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: {
            bool: {
              must: matchers,
            },
          },
          size: 1,
          sort: [
            {
              DateTime: {
                order: "desc",
              },
            },
          ],
        }),
      } as any);
      console.timeEnd("data-fetch");
      const results = (await res.json()).hits.hits[0]._source;
      if (!dates.startDate) {
        const startingDate = DateTime.fromISO(results.DateTime).toUTC();
        const endingDate = startingDate.plus({ days: 1 }).toUTC();
        setDates({ startDate: startingDate.toJSDate(), endDate: endingDate.toJSDate() });
        console.log("latest trending date", startingDate, endingDate);
      }

      console.log("latest trending results", results);

      setLatestTrendingResults(results);
    };
    fetchLatestTrending();
  }, [dates]);

  useEffect(() => {
    if (queryText) {
      console.log(`sending query for ${queryText}`);
      setEsResults({});
    }
  }, [queryText]);

  const [elasticsearchResults, setEsResults] = useState({} as any);
  useEffect(() => {
    const executeElasticsearchCall = async () => {
      if (dates.startDate) {
        console.log("sending query...");
        console.time("data-fetch");
        const res = await fetch(`${ES_ENDPOINT}truncindex/_search`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            size: 10000,
            query: {
              bool: {
                must: [
                  queryText
                    ? {
                        match: {
                          ContextualText: queryText,
                        },
                      }
                    : null,
                  {
                    range: {
                      DateTime: {
                        gte: dates.startDate,
                        lt: dates.endDate,
                      },
                    },
                  },
                ],
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
      } else {
        console.log("no dates found, skipping query");
      }
    };
    if (elasticsearchResults) {
      console.log(elasticsearchResults);
    }
    executeElasticsearchCall();
  }, [dates, queryText]);

  useEffect(() => {
    console.log("received search results", elasticsearchResults);
  }, [elasticsearchResults]);

  useEffect(() => {
    console.log(topicSelection);
  }, [topicSelection]);

  useEffect(() => {
    if (trendingTopicSelection && elasticsearchResults) {
      const k = Array.from(new Set(elasticsearchResults.hits.hits.map((i: any) => i._source.topic)));
      const topicMap = lodash.fromPairs(k.map((el: any) => [el.split("_").slice(1).join("_"), el]));
      setTopicSelection(topicMap[trendingTopicSelection]);
    }
  }, [trendingTopicSelection, elasticsearchResults]);

  return (
    <>
      <div className="flex flex-col my-1 px-1 w-1/5">
        <AverageTone
          topicFilter={topicSelection}
          plotData={elasticsearchResults}
          startDate={dates.startDate}
          endDate={dates.endDate}
        />

        <ToneHistogramPane
          topicFilter={topicSelection}
          plotData={elasticsearchResults}
          startDate={dates.startDate}
          endDate={dates.endDate}
        />

        <Trending trendingTopicHandler={setTrendingTopicSelection} trendingList={latestTrendingResults} />
      </div>

      <div className="flex flex-col my-1 px-1 w-3/5">
        <CenterPane
          dates={dates}
          datesHandler={setDates}
          plotData={elasticsearchResults}
          searchFieldHandler={setQueryText}
          scatterPlotMouseOverHandler={scatterPlotMouseOverHandler}
          topicSelectionHandler={setTopicSelection}
          externalTopic={topicSelection}
        />
      </div>

      <div className="flex flex-col my-1 px-1 w-1/5 overflow-hidden">
        <Articles data={mouseoverDataPoint} />
      </div>
    </>
  );
}

export function Trending({
  trendingList,
  trendingTopicHandler,
}: {
  trendingTopicHandler: any;
  trendingList: any;
}): JSX.Element {
  const topicsPairs = lodash.zip(trendingList.count, trendingList.rank);
  const topicKeywords = topicsPairs.map((i) => i.join("_"));
  console.log("trending topics", topicsPairs);
  return (
    <div className="m-1 h-1/3 shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">Trending</h3>
      <ul className="list-decimal pl-6">
        {topicsPairs.slice(0, 5).map((el) => {
          return (
            <li data-value={el[1]} className="my-3">
              {String(el[1])
                .split("_")
                .map((topicKeyword: string) => (
                  <span
                    onClick={(e: any) => {
                      trendingTopicHandler(e.target.parentNode.getAttribute("data-value"));
                    }}
                    className="inline-flex items-center px-2.5 py-0.5 mx-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {topicKeyword}
                  </span>
                ))}
            </li>
          );
        })}
      </ul>
    </div>
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
