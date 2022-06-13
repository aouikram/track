// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiBaseUrl:'http://localhost:8095',
  mapbox: {
    accessToken:
     'pk.eyJ1IjoiYW91aWtyYW0iLCJhIjoiY2wzOGtkazVkMDByZjNjcGR5ZnNlNzJ0MyJ9.2TIG4FOESzfLjQWmd4aywA',
  },
};
