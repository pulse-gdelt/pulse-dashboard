import React, { useEffect, useState } from "react";
import { ScatterPlot, data } from "../../components/ScatterPlot";

// export function scatterPlotMouseOverHandler(event: any, datapoint: any): void {
//   console.log(datapoint)
// }

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
        <div className="px-4 py-5 h-full w-full flex">
          {ss.hits ? <ScatterPlot dataParam={ss.hits.hits} mouseoverHandler={scatterPlotMouseOverHandler} /> : null}
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

  return (
    <div className="m-1 h-full shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6 overflow-hidden">
      <h3 className="text-lg leading-6 font-medium text-gray-900">News Event Information</h3>
      <ul className="divide-y divide-gray-200">
        <p>{JSON.stringify(data.datapoint, null, 2)}</p>
        {/* <li className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
          <div className="flex justify-between space-x-3">
            <div className="min-w-0 flex-1">
              <a href="#" className="block focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 truncate">BBC</p>
                <p className="text-sm text-gray-500 truncate">Velit placeat sit ducimus non sed</p>
              </a>
            </div>
            <time dateTime="2021-01-27T16:35" className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
              2h ago
            </time>
          </div>
          <div className="mt-1">
            <p className="line-clamp-2 text-sm text-gray-600">
              Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque
              qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod
              dolor.
            </p>
          </div>
        </li>
        <li className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
          <div className="flex justify-between space-x-3">
            <div className="min-w-0 flex-1">
              <a href="#" className="block focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 truncate">Al Jazeera</p>
                <p className="text-sm text-gray-500 truncate">Velit placeat sit ducimus non sed</p>
              </a>
            </div>
            <time dateTime="2021-01-27T16:35" className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
              12h ago
            </time>
          </div>
          <div className="mt-1">
            <p className="line-clamp-2 text-sm text-gray-600">
              Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque
              qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod
              dolor.
            </p>
          </div>
        </li>
        <li className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
          <div className="flex justify-between space-x-3">
            <div className="min-w-0 flex-1">
              <a href="#" className="block focus:outline-none">
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="text-sm font-medium text-gray-900 truncate">SCMP</p>
                <p className="text-sm text-gray-500 truncate">Velit placeat sit ducimus non sed</p>
              </a>
            </div>
            <time dateTime="2021-01-27T16:35" className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
              2d ago
            </time>
          </div>
          <div className="mt-1">
            <p className="line-clamp-2 text-sm text-gray-600">
              Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque
              qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod
              dolor.
            </p>
          </div>
        </li> */}
      </ul>
    </div>
  );
}
