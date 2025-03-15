const axios = require("axios");

const API_URL = ""; // Altere para o endpoint correto
const REQUESTS_PER_BATCH = 50; // Número de requisições simultâneas
const TOTAL_BATCHES = 10; // Quantidade de lotes de requisições

const HEADERS = {
    Cookie: "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpbmZvcyI6W3siaWRVc2VyIjoxLCJuaWNrTmFtZSI6ImFkbWluIiwidXNlck5hbWUiOiJBZG1pbmlzdHJhdG9yIiwidXNlckVtYWlsIjoiamV0dEBnMDEudGVjaCIsImRlZmF1bHRMYW5ndWFnZSI6MH1dLCJpYXQiOjE3NDIwNTc4NjcsImV4cCI6MTc0MjA5Mzg2N30.8_SJzC7XUnLeajV8URpp4jYm-crQgjntuW90FxVsH6k",
    "x-system": "JT",
    "x-region": "01"
}

let successCount = 0;
let failureCount = 0;

async function makeRequest(i) {
    try {
        const response = await axios.post(API_URL, {
            tableName: "Platform",
            fieldName: "platform"
        }, { headers: HEADERS });

        if (response.status === 200) {
            successCount++;
        }

        console.log(`Request ${i} Status:`, response.status);
    } catch (error) {
        failureCount++;
        console.error(`Request ${i} Error:`, error.message);
    }
}

async function stressTest() {
    console.log(`Iniciando teste de estresse: ${REQUESTS_PER_BATCH * TOTAL_BATCHES} requisições...`);

    const startTime = Date.now();

    for (let batch = 0; batch < TOTAL_BATCHES; batch++) {
        console.log(`Executando lote ${batch + 1}...`);
        const requests = [];

        for (let i = 0; i < REQUESTS_PER_BATCH; i++) {
            requests.push(makeRequest(batch * REQUESTS_PER_BATCH + i));
        }

        await Promise.all(requests);
    }

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    const totalRequests = successCount + failureCount;
    const successRate = totalRequests > 0 ? (successCount / totalRequests) * 100 : 0;

    console.log("\n--- Resumo do Teste ---");
    console.log(`✅ Requisições com sucesso: ${successCount}`);
    console.log(`❌ Requisições falhas: ${failureCount}`);
    console.log(`📊 Porcentagem de sucesso: ${successRate.toFixed(2)}%`);
    console.log(`⏱️  Tempo total de execução: ${totalTime.toFixed(2)} segundos`);
}


stressTest();
