const projectId = 'prj-d-contract-doc-ai-1'
const location = 'us' // Format is 'us' or 'eu'
const processorId = '76201d7043ecc8af' // Create processor in Cloud Console
const filePath1 = 'http://localhost:4200/alfresco/api/-default-/public/alfresco/versions/1/nodes/f0af46ec-c942-464c-b3b9-f9ad90a52556/content?attachment=false&alf_ticket=TICKET_6e8718454416b4b6e65762159a4bb5765fb43229'
// const filePath2 = 'C:/Users/S.W.R.T/Downloads/wordpress-pdf-invoice-plugin-sample1.pdf'
const filePath2 = 'F:/Task/CloudWave/Workspace/invoice-openai/frontend/public/test/Paycheck_2022-05-14_2022-05-27.pdf'

const { DocumentProcessorServiceClient } = require('@google-cloud/documentai').v1

// Instantiates a client
const client = new DocumentProcessorServiceClient()

async function quickstart() {
    // The full resource name of the processor, e.g.:
    // projects/project-id/locations/location/processor/processor-id
    // You must create new processors in the Cloud Console first
    const name = `projects/${projectId}/locations/${location}/processors/${processorId}`

    // Read the file into memory.
    // const axios = require('axios')
    // const resp = await axios.get(filePath1, {responseType: 'arraybuffer'})

    const fs = require('fs').promises;
    const imageFile = await fs.readFile(filePath2)

    // Convert the image data to a Buffer and base64 encode it.
    // const encodedImage = Buffer.from(resp.data).toString('base64')
    const encodedImage = Buffer.from(imageFile).toString('base64')

    const request = {
        name,
        rawDocument: {
            content: encodedImage,
            mimeType: 'application/pdf',
        },
    }

    // Recognizes text entities in the PDF document
    const [metadata] = await client.processDocument(request)

    // Read the text recognition output from the processor
    // For a full list of Document object attributes,
    // please reference this page: https://googleapis.dev/nodejs/documentai/latest/index.html
    const { document } = metadata
    const { entities } = document

    const filters = ['supplier_name', 'supplier_address', 'receiver_name', 'receiver_address', 'invoice_date', 'due_date', 'delivery_date', 'total_amount', 'currency']

    // Read the text recognition output from the processor
    const params = new Array
    entities.forEach(entity => {
        if (filters.includes(entity.type)) {
             const value = entity.normalizedValue && entity.normalizedValue.text.length > 0 ? entity.normalizedValue.text : entity.mentionText
             params[entity.type] = value.replace(/\s+/g, ' ').trim()
        }
    })

    console.log(params)
}

quickstart()