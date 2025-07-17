import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// 📊 Métricas personalizadas
export let htmlDuration = new Trend('html_response_time');

export let options = {
  stages: [
  { duration: '10s', target: 20 },
  { duration: '20s', target: 50 },
  { duration: '20s', target: 100 },
  { duration: '10s', target: 20 },
  { duration: '10s', target: 0 },
],
  thresholds: {
    http_req_duration: ['p(95)<800'],
    http_req_failed: ['rate<0.01'],
    checks: ['rate>0.95'],
  },
};

const pages = [
  'http://localhost:3000/',
  'http://localhost:3000/peliculas',
  'http://localhost:3000/pelicula/el-dia-mas-largo-de-maggie',
  'http://localhost:3000/pelicula/los-simpson-la-pelicula',
  'http://localhost:3000/temporadas/1',
  'http://localhost:3000/temporadas/2',
  'http://localhost:3000/temporadas/3',
  'http://localhost:3000/temporadas/4',
  'http://localhost:3000/temporada/1x01',
  'http://localhost:3000/temporada/1x02',
  'http://localhost:3000/temporada/3x04',
];

export default function () {
  const url = pages[Math.floor(Math.random() * pages.length)];
  const res = http.get(url);

  htmlDuration.add(res.timings.duration); // Añadimos el tiempo total

  check(res, {
    '✅ Código 200': (r) => r.status === 200,
    '✅ Contiene HTML o JSON': (r) =>
      typeof r.body === 'string' &&
      (r.body.includes('<html') ||
        (r.headers['content-type'] || '').includes('application/json')),
  });

  sleep(1);
}
