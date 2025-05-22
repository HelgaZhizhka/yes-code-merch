# Feature-Sliced Design 
[FSD](https://feature-sliced.github.io/documentation/ru/docs/get-started)
# Structure 
```
└── src/
    ├── app/                    # initial logic application               
    |                           #
    ├── pages/                  # Layer: pages (router)
    |   ├── {some-page}/        #     Slice: (example: Product page)
    |   |   ├── api/            #         Segment: API logic (api instances, mappers, requests, ...)
    |   |   ├── lib/            #         Segment: Infrastructure logic (helpers/utils)
    |   |   ├── model/          #         Segment: Business logic
    |   |   └── ui/             #         Segment: UI logic 
    |   ...                     #
    |                           #
    ├── widgets/                # Layer: reusable UI components
    |   ├── {some-widget}/      #     Slice: (example: Header widget)
    |   |   ├── api/            #         Segment: API logic (api instances, mappers, requests, ...)
    |   |   ├── lib/            #         Segment: Infrastructure logic (helpers/utils)
    |   |   ├── model/          #         Segment: Business logic ( state management, tests...)
    |   |   └── ui/             #         Segment: UI logic
    ├── features/               #  Layer: reusable business logic features
    |   ├── {some-feature}/     #     Slice: (example: Cart feature)
    |   |   ├── api/            #         Segment: API logic (api instances, mappers, requests, ...)
    |   |   ├── lib/            #         Segment: Infrastructure logic (helpers/utils)
    |   |   ├── model/          #         Segment: Business logic  ( state management, tests...)
    |   |   └── ui/             #         Segment: UI logic
    |   ...                     #
    |                           #
    ├── entities/               # Layer: reusable entities
    |   ├── {some-entity}/      #    Slice: (example: Product entity)
    |   |   ├── api/            #         Segment: API logic (api instances, mappers, requests, ...)
    |   |   ├── lib/            #         Segment: Infrastructure logic (helpers/utils)
    |   |   ├── model/          #         Segment: Business logic  ( state management, tests...)
    |   |   └── ui/             #         Segment: UI logic
    |   ...                     #
    |                           #
    ├── shared/                 # Layer: reusable shared logic
    |   ├── api/                #         Segment: API logic (supabase api client, ...)
    |   ├── model/              #         Segment: Business logic ( global store ...)
    |   |  ├── theme/           #         Segment: Theme (theme, colors, fonts ...)
    |   |  |   ├── useThemeStore.ts 
    |   |  ├── auth/            #         Segment: Auth store (auth, user ...)
    |   ├── config/             #         Segment: Configuration (env, constants, ...)
    |   ├── lib/                #         Segment: Infrastructure logic (helpers/utils)
    |   └── ui/                 #         Segment: UI logic
    ├── styles/                 # Layer: global styles
    |   ├── global.css          #         Segment: Global styles
    |   ├── tailwind.config.js  #         Segment: Tailwind CSS configuration
    |   └── postcss.config.js   #         Segment: PostCSS configuration
    ├── assets/                 # Layer: static assets
    |   ├── images/             #         Segment: Images
    |   ├── fonts/              #         Segment: Fonts
    |   └── icons/              #         Segment: Icons
    ├── public/                 # Layer: public assets
    |   ├── favicon.ico         #         Segment: Favicon
    |   └── robots.txt          #         Segment: Robots.txt
    |   ...                     #
    ├──__tests__/               # Layer: tests
    |   └── e2e/                #         Segment: End-to-end tests
    |   ...                     #
    |                           #
    ├── hydrate.tsx             #         Segment: Hydration logic for server-side rendering
    ├── server.ts               #         Segment: Server-side rendering logic
    └── main.tsx                #         Segment: Entry point for the application
    └── index.html              #         Segment: HTML entry point
```