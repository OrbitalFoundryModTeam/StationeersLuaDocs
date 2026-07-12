<script setup lang="ts">
import { onMounted } from 'vue'
import SwaggerUIBundle from 'swagger-ui-dist/swagger-ui-es-bundle'
import 'swagger-ui-dist/swagger-ui.css'
import '../swagger-dark.css'

onMounted(() => {
  const specUrl = `${import.meta.env.BASE_URL}openapi/extension-api.yaml`

  SwaggerUIBundle({
    dom_id: '#swagger-ui',
    url: specUrl,
    deepLinking: true,
    tryItOutEnabled: false,
    supportedSubmitMethods: [],
    defaultModelsExpandDepth: 1,
    defaultModelExpandDepth: 1,
    docExpansion: 'list',
    filter: true,
    syntaxHighlight: {
      activate: true,
      theme: 'monokai',
    },
    plugins: [
      () => ({
        wrapComponents: {
          Servers: () => () => null,
        },
      }),
    ],
  })
})
</script>

<template>
  <div id="swagger-ui" class="swagger-ui-host" />
</template>

<style scoped>
.swagger-ui-host {
  margin-top: 1rem;
}

:global(.swagger-ui .servers),
:global(.swagger-ui .scheme-container) {
  display: none !important;
}
</style>
