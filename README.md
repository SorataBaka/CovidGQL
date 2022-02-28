# Indonesian COVID-19 GraphQL API Data
## What is this for?
This is an GraphQL API Wrapper for the Indonesian Government's Covid-19 API Endpoint. (Reference below for resources used)

The resources provided by the Indonesian government are notably tedious, inconsistent, and hard to read and understand. As such, this API is created to provide much cleaner and easier to use data for the public to use; while at the same time integrating GraphQL for cleaner usage.

## Notes
This API is a work in progress. You are free to use as is or contribute to the progress.

Feel free to request a feature or extra data that you think are important to be included in an endpoint! I'll be more than happy to work on it.

## Libries Used

<ul>
  <li> express </li>
  <li> express-graphql </li>
  <li> axios </li>
</ul>

## Notable Endpoints

No endpoint currently available

## Notable Resources:
<ul>
  <li><strong>https://data.covid19.go.id/public/api/update.json</strong> (Seluruh Indonesia)
    <br>
    <ul>
      <li>
        Jumlah penambahan harian sejak awal pandemi
      </li>
      <li>
        Jumlah penambahan terbaru
      </li>
      <li>
        Total kasus sejak awal pandemi
      </li>
    </ul>
  </li>
  <li><strong>https://data.covid19.go.id/public/api/prov.json</strong> (Per Provinsi)
    <br>
    <ul>
      <li>
        Total kasus sejak awal pandemi berdasarkan provinsi
      </li>
      <li>
        Jumlah penambahan terbaru berdasarkan provinsi
      </li>
    </ul>
  </li>
  <li><strong>https://data.covid19.go.id/public/api/prov_time.json</strong>
    <br>
    <ul>
      <li>
        Penambahan harian seluruh indonesia sejak awal pandemi
      </li>
      <li>
        Penambahan harian berdasarkan provinsi sejak awal pandemi
      </li>
      <li>
        Total kasus per hari berdasarkan provinsi sejak awal pandemi
      </li>
    </ul>
  </li>
</ul>