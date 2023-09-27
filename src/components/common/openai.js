import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: localStorage.getItem('api'),
    dangerouslyAllowBrowser: true
});

export default openai;

