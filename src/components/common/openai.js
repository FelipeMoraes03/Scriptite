import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: localStorage.getItem('api'),
    dangerouslyAllowBrowser: true
});

export default openai;

//.env  REACT_APP_OPENAI_API_KEY="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"