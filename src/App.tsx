import React from "react";

export function App(): JSX.Element {
  return (
      <div className="flex flex-col h-full">
        <div className="w-24 min-w-full h-auto">
          <NavBar />
        </div>
        <div className="h-full flex flex-row min-w-full bg-gray-200 rounded-lg">
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
            <div className="my-1 -mx-1 h-full bg-white shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6" />
            </div>
          </div>

          <div className="flex flex-col my-1 px-1 w-1/5 overflow-hidden">
            <div className="m-1 h-full shadow rounded-lg bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Articles</h3>
              <ul className="divide-y divide-gray-200">
                <li className="relative bg-white py-5 px-4 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600">
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
                      Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim
                      rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt
                      maiores et accusamus quod dolor.
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
                      Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim
                      rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt
                      maiores et accusamus quod dolor.
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
                      Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim
                      rerum eaque qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt
                      maiores et accusamus quod dolor.
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  );
}

export function NavBar(): JSX.Element {
  return (
    <nav className="bg-white shadow overflow-hidden h-auto">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex content-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/*
          Icon when menu is closed.

          Heroicon name: outline/menu

          Menu open: "hidden", Menu closed: "block"
        */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              {/*
          Icon when menu is open.

          Heroicon name: outline/x

          Menu open: "block", Menu closed: "hidden"
        */}
              <svg
                className="hidden h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch">
            <div className="flex-shrink-0 flex items-center mt-1">
              <svg
                className="h-8 w-auto p-1"
                viewBox="0.22748303413391113 13.68918514251709 99.5455093383789 72.6233901977539"
              >
                <g fill="#063970">
                  <path d="M98.569 57.02l-21.291-2.927-8.256-36.644-.012-.06a4.75 4.75 0 0 0-9.254-.047L48.048 66.696 37.007 32.288l-.015-.048a4.285 4.285 0 0 0-8.212.229l-5.938 22.193L1.464 57.02a1.39 1.39 0 0 0 0 2.763l24.618 2.715a3.57 3.57 0 0 0 3.825-2.573l.123-.434 3.177-11.179 11.488 35.134c.433 1.292 1.5 2.371 2.918 2.735a4.159 4.159 0 0 0 5.062-2.993l.007-.026L64.02 39.006l4.502 20.453.132.603a4.147 4.147 0 0 0 4.611 3.201l25.302-3.479a1.395 1.395 0 0 0 .002-2.764z" />
                </g>
              </svg>
              <svg
                className="h-7 w-auto p-1"
                viewBox="9.960000038146973 -73.91000366210938 298.010009765625 74.7300033569336"
              >
                <g fill="black">
                  <path d="M9.96 -73.09L9.96 0L14.17 0L14.17 -33.47L36.96 -33.47C44.07 -33.47 49.7 -35.25 53.84 -38.8C57.98 -42.36 60.05 -47.22 60.05 -53.38C60.05 -59.54 58 -64.37 53.89 -67.86C49.79 -71.35 44.14 -73.09 36.96 -73.09ZM36.85 -37.67L14.17 -37.67L14.17 -69.09L36.85 -69.09C42.88 -69.09 47.48 -67.72 50.66 -64.98C53.84 -62.24 55.43 -58.38 55.43 -53.38C55.43 -48.39 53.84 -44.52 50.66 -41.78C47.48 -39.04 42.88 -37.67 36.85 -37.67Z M81.97 -6.42C86.66 -1.59 93.55 0.82 102.66 0.82C111.69 0.82 118.55 -1.59 123.24 -6.42C127.93 -11.24 130.27 -18.34 130.27 -27.72L130.27 -73.09L125.96 -73.09L125.96 -27C125.96 -19.2 123.99 -13.31 120.06 -9.34C116.12 -5.37 110.32 -3.39 102.66 -3.39C86.98 -3.39 79.15 -11.26 79.15 -27L79.15 -73.09L74.94 -73.09L74.94 -27.72C74.94 -18.34 77.28 -11.24 81.97 -6.42Z M149.57 0L192.69 0L192.69 -3.9L153.78 -3.9L153.78 -73.09L149.57 -73.09Z M208.96 -1.54C213.23 0.03 218.25 0.82 224 0.82C228.99 0.82 233.39 -0.02 237.19 -1.69C240.99 -3.37 243.91 -5.7 245.96 -8.67C248.02 -11.65 249.04 -15.06 249.04 -18.89C249.04 -22.93 247.97 -26.14 245.81 -28.54C243.65 -30.93 241.04 -32.7 237.96 -33.83C234.88 -34.95 230.84 -36.1 225.84 -37.26L221.22 -38.39C215.48 -39.83 211.01 -41.61 207.83 -43.73C204.65 -45.85 203.05 -49.1 203.05 -53.48C203.05 -58.62 204.89 -62.6 208.55 -65.44C212.21 -68.28 217.32 -69.7 223.89 -69.7C228.21 -69.7 232.14 -68.97 235.7 -67.5C239.26 -66.03 242.78 -63.68 246.27 -60.46L248.43 -64.06C242.2 -70.63 234.02 -73.91 223.89 -73.91C218.76 -73.91 214.3 -73.07 210.5 -71.4C206.7 -69.72 203.77 -67.36 201.72 -64.31C199.67 -61.27 198.64 -57.73 198.64 -53.69C198.64 -49.1 199.91 -45.48 202.44 -42.81C204.97 -40.14 207.86 -38.22 211.11 -37.06C214.36 -35.9 218.9 -34.63 224.71 -33.26C229.09 -32.23 232.6 -31.26 235.24 -30.33C237.87 -29.41 240.08 -28.04 241.86 -26.23C243.64 -24.42 244.53 -22.07 244.53 -19.2C244.53 -14.2 242.73 -10.32 239.14 -7.55C235.55 -4.77 230.5 -3.39 224 -3.39C218.73 -3.39 214.24 -4.09 210.55 -5.49C206.85 -6.9 203.19 -9.27 199.56 -12.63L197.41 -9.03C200.83 -5.61 204.68 -3.11 208.96 -1.54Z M264.03 0L307.97 0L307.97 -4L268.34 -4L268.34 -35.01L305.92 -35.01L305.92 -39.11L268.34 -39.11L268.34 -69.09L307.97 -69.09L307.97 -73.09L264.03 -73.09Z" />
                </g>
              </svg>
              {/* <img className="block lg:hidden h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" /> */}
              {/* <img className="hidden lg:block h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-logo-indigo-600-mark-gray-800-text.svg" alt="Workflow" /> */}
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
              <a
                href="#"
                className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Dashboard
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                About
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Literature
              </a>
              <a
                href="#"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
