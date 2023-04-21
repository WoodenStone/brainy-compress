import http from "k6/http"
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js'
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";
import { sleep, check } from "k6"


// read file from disk
const filename = 'test.png'
const filetype = 'image/png'
const binFile = open(filename, 'b')

export const options = {
    vus: 10,
    duration: '60s',
}


export default function () {
    const url = `http://${__ENV.ENDPOINT}/v1/compress`
    const f = http.file(binFile, filename, filetype)

    const fd = new FormData();
    fd.append('metric', 'mse');
    fd.append('quality', '1');
    fd.append('filename', filename);
    fd.append('filetype', filetype);
    fd.append('model', 'bmshj2018-factorized');
    fd.append('file', f);

    const res = http.post(url, fd.body(), {
        headers: { 'Content-Type': 'multipart/form-data; boundary=' + fd.boundary },
    })

    check(res, {
        'is status 200': (r) => r.status === 200,
    })

}

export function handleSummary(data) {
    return {
      "result.html": htmlReport(data),
      stdout: textSummary(data, { indent: " ", enableColors: true }),
    };
  }