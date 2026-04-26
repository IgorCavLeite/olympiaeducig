import { Request, Response } from 'express';
import {GoogleGenerativeAI} from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const SYSTEM_PROMPT = `Você é o OlympIA, um tutor especialista em olimpíada acadêmica brasileira.
                      Seu foco é ajudar estudantes na olimpíada OBB (Biologia)

                      Diretrizes:
                      - Seja direto e conciso, respondendo em no máximo 3-4 parágrafos curtos
                      - Prefira respostas objetivas; só detalhe mais se o aluno pedir
                      - Explique conceitos de forma clara e didática, adaptando ao nível do aluno
                      - Use exemplos práticos e resolva problemas passo a passo
                      - Incentive o raciocínio do aluno antes de dar a resposta direta
                      - Quando resolver exercícios, mostre o raciocínio completo
                      - Seja encorajador e motivador
                      - Responda sempre em português brasileiro
                      - Mantenha o foco em conteúdos acadêmicos e olimpíadas`;

export const chat = async (req:Request, res: Response) => {
    const {message, history} = req.body;
    if (!message){
        return res.status(400).json({error: 'Mensagem é obrigatória'});
        }
    try {
        const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        systemInstruction: SYSTEM_PROMPT,
        generationConfig: {
        maxOutputTokens: 200, //limita o tamanho da resposta
        temperature: 0.7,
        },
        });
    const formattedHistory = (history || []).map((msg: {sender: string; text: string}) => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{text: msg.text}],
    }));

    const chatSession = model.startChat({history: formattedHistory});

    const result = await chatSession.sendMessage(message);
    const reply = result.response.text();
    return res.json({reply});

    }catch (error: any) {
        console.error('Erro ao chamar o Gemini:', error.message);
        res.status(500). json({error: 'Erro ao processar sua resposta da IA'});
        }
};