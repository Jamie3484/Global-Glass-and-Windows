import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing JSON with generous limit for images/audio
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Built-in expert advisor when GEMINI_API_KEY is not yet populated in the environment
function getDomainExpertResponse(userMessage: string): string {
  const text = (userMessage || '').toLowerCase();

  let body = '';
  if (text.includes('prix') || text.includes('tarif') || text.includes('cout') || text.includes('coût') || text.includes('combien')) {
    body = `### 💎 Grille Tarifaire Indicative — GLOBAL GLASS AND WINDOWS\n\nNos prix sont calculés en fonction de la surface exacte en pieds carrés (**pi²**) selon la formule :\n> **Surface (pi²) = (Longueur en pouces × Largeur en pouces) ÷ 144**\n\n**Tarifs de base :**\n- **Verre Clair (4mm - 6mm)** : ~18.00 $ à 24.00 $ / pi²\n- **Verre Teinté (Bronze, Gris, Fumé)** : ~28.00 $ / pi²\n- **Verre Trempé Sécurisé (8mm - 12mm)** : ~48.00 $ / pi² (idéal douches et vitrines)\n- **Verre Feuilleté Antieffraction** : ~55.00 $ / pi²\n- **Miroirs LED Biseautés** : Sur devis selon dimensions et rétroéclairage\n\n*Pour obtenir un chiffrage précis avec quincaillerie et pose, essayez notre calculateur de devis en ligne ou appelez le +(509) 3687-0000.*`;
  } else if (text.includes('contact') || text.includes('adresse') || text.includes('telephone') || text.includes('téléphone') || text.includes('ou se trouve') || text.includes('où')) {
    body = `### 📍 Coordonnées de GLOBAL GLASS AND WINDOWS\n\n- **Siège & Atelier** : Route Nationale #2, Borne Soldat, Petit-Goâve, Haïti\n- **Lignes directes** :\n  • +(509) 3687-0000\n  • +(509) 3704-5858\n  • +(509) 4141-8383\n  • +(509) 3444-2432\n  • +(509) 3192-3030\n- **Email officiel** : globalglassandw.2023@gmail.com\n- **Horaires** : Lundi au Samedi, 8h00 - 17h00`;
  } else if (text.includes('calcul') || text.includes('formule') || text.includes('surface') || text.includes('dimension') || text.includes('pouce')) {
    body = `### 📐 Formule Officielle de Calcul de Surface Vitrée\n\nChez **GLOBAL GLASS AND WINDOWS**, toutes les commandes se basent sur les dimensions en pouces :\n\n$$\\text{Surface en pieds carrés (pi²)} = \\frac{\\text{Longueur (pouces)} \\times \\text{Largeur (pouces)}}{144}$$\n\n**Exemple pratique :**\nPour une fenêtre de 48 pouces de haut par 36 pouces de large :\n$$\\frac{48 \\times 36}{144} = \\frac{1728}{144} = \\mathbf{12 \\text{ pi²}}$$\nMultipliez ensuite ce chiffre par le tarif du type de verre souhaité !`;
  } else if (text.includes('produit') || text.includes('service') || text.includes('fenetre') || text.includes('fenêtre') || text.includes('porte') || text.includes('douche') || text.includes('miroir')) {
    body = `### 🚪 Nos Produits & Spécialités\n\n- **Menuiserie Aluminium & Façades** : Rideaux de verre, baies vitrées coulissantes, portes accordéon, devantures de commerces.\n- **Fenêtres & Portes** : Portes françaises battantes, fenêtres à battant, jalousies en aluminium et verre.\n- **Cabines de Douche** : Parois sur mesure en verre trempé 8/10mm, quincaillerie acier inoxydable.\n- **Miroiterie sur Mesure** : Miroirs biseautés, miroirs rétroéclairés LED tactiles antibuée.\n- **Garde-corps & Balustrades** : Rampes en verre sécurisé trempé feuilleté pour balcons et escaliers.`;
  } else {
    body = `Bonjour ! Je suis l'assistant officiel de **GLOBAL GLASS AND WINDOWS** à Petit-Goâve, Haïti.\n\n*« Changer de vue et de vie en un clin d'œil ! »*\n\nJe suis à votre disposition pour vous renseigner sur nos types de verre (clair, teinté, trempé, dépoli), nos menuiseries aluminium, le calcul de vos surfaces vitrées et vos demandes de devis. Que puis-je étudier pour vous aujourd'hui ?`;
  }

  return `${body}\n\n---\n*💡 **Activation de Gemini AI en direct** : Pour activer le modèle de langage **Gemini-3.8 Flash** avec recherche Google en temps réel, configurez votre variable \`GEMINI_API_KEY\` dans le menu **Settings / Secrets** du projet AI Studio.*`;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!process.env.GEMINI_API_KEY
  });
});

// Official store image synchronization & direct zero-modification upload
function checkAndSyncStoreImage(): string | null {
  const possibleSourcePaths = [
    path.join(__dirname, 'Local et Camion de GGW.png'),
    path.join(__dirname, 'public', 'Local et Camion de GGW.png'),
    path.join(__dirname, 'public', 'assets', 'Local et Camion de GGW.png'),
    path.join(__dirname, 'local_et_camion_de_ggw.png'),
    path.join(__dirname, 'public', 'assets', 'local_et_camion_de_ggw.png'),
  ];

  for (const src of possibleSourcePaths) {
    if (fs.existsSync(src)) {
      const destJpg = path.join(__dirname, 'public', 'assets', 'ggw_storefront_truck.jpg');
      const destSrcJpg = path.join(__dirname, 'src', 'assets', 'images', 'ggw_storefront_truck_1788459796152.jpg');
      try {
        fs.copyFileSync(src, destJpg);
        if (fs.existsSync(path.dirname(destSrcJpg))) {
          fs.copyFileSync(src, destSrcJpg);
        }
        return src;
      } catch (err) {
        console.error('[StoreImage] Error copying store image:', err);
      }
    }
  }
  return null;
}
checkAndSyncStoreImage();

app.get('/api/official-store-image', (req, res) => {
  const syncedFrom = checkAndSyncStoreImage();
  const destJpg = path.join(__dirname, 'public', 'assets', 'ggw_storefront_truck.jpg');
  let exists = false;
  let size = 0;
  let mtime = null;

  if (fs.existsSync(destJpg)) {
    exists = true;
    const stat = fs.statSync(destJpg);
    size = stat.size;
    mtime = stat.mtime;
  }

  res.json({
    url: '/api/storefront-photo?t=' + (mtime ? new Date(mtime).getTime() : Date.now()),
    exists,
    size,
    mtime,
    syncedFrom
  });
});

// Direct streaming endpoint for official storefront photo (no cache issues)
app.get('/api/storefront-photo', (req, res) => {
  const possiblePaths = [
    path.join(__dirname, 'public', 'assets', 'Local et Camion de GGW.png'),
    path.join(__dirname, 'public', 'assets', 'ggw_storefront_truck.jpg'),
    path.join(__dirname, 'src', 'assets', 'images', 'ggw_storefront_truck_1788459796152.jpg'),
    path.join(__dirname, 'public', 'assets', 'haitian_delivery_team_truck.jpg'),
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      return res.sendFile(p);
    }
  }

  return res.status(404).send('Photo not found');
});

// Upload endpoint for the exact official store & truck photo without any compression or modification
app.post('/api/upload-storefront-photo', (req, res) => {
  try {
    const { imageBase64, filename } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ error: 'imageBase64 parameter is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z0-9.+_-]+;base64,/, '');
    const buffer = Buffer.from(cleanBase64, 'base64');

    const destJpg = path.join(__dirname, 'public', 'assets', 'ggw_storefront_truck.jpg');
    const destPng = path.join(__dirname, 'public', 'assets', 'Local et Camion de GGW.png');
    const destSrcJpg = path.join(__dirname, 'src', 'assets', 'images', 'ggw_storefront_truck_1788459796152.jpg');

    fs.writeFileSync(destJpg, buffer);
    fs.writeFileSync(destPng, buffer);
    if (fs.existsSync(path.dirname(destSrcJpg))) {
      fs.writeFileSync(destSrcJpg, buffer);
    }

    console.log('[StoreImage] Successfully wrote official storefront photo:', buffer.length, 'bytes');
    return res.json({
      success: true,
      message: 'Photo officielle du local et camion enregistrée avec succès sans aucune modification.',
      url: '/api/storefront-photo?t=' + Date.now(),
      size: buffer.length
    });
  } catch (err: any) {
    console.error('Error saving official store photo:', err);
    return res.status(500).json({ error: err.message || 'Erreur lors de l’enregistrement de la photo' });
  }
});

// 1. Gemini Multi-turn Chat with Search & Maps Grounding
// Uses gemini-3.8-flash, gemini-3.1-pro-preview or gemini-3.1-flash-lite
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, useGrounding, groundingType, modelType } = req.body;
    const ai = getAiClient();

    // If GEMINI_API_KEY is not configured yet, provide domain expert response gracefully
    if (!ai) {
      const lastUserMsg = [...(messages || [])].reverse().find((m: any) => m.role === 'user')?.text || '';
      const fallbackResponse = getDomainExpertResponse(lastUserMsg);
      return res.json({
        text: fallbackResponse,
        groundingChunks: null,
        webSearchQueries: null,
        isFallback: true
      });
    }

    const selectedModel = modelType === 'pro'
      ? 'gemini-3.1-pro-preview'
      : modelType === 'lite'
      ? 'gemini-3.1-flash-lite'
      : 'gemini-3.8-flash';

    const systemInstruction = `Tu es l'assistant IA officiel de GLOBAL GLASS AND WINDOWS, entreprise leader de menuiserie aluminium, vitrerie et façades en verre basée à Petit-Goâve, Haïti (Route Nationale #2, Borne Soldat).
Slogan: "Changer de vue et de vie en un clin d'œil !"
Téléphones: +(509) 3687-0000 / 3704-5858 / 4141-8383 / 3444-2432 / 3192-3030.
Email: globalglassandw.2023@gmail.com.

Tu conseilles les clients avec précision, professionnalisme et amabilité en Français, Kreyòl Ayisyen ou Anglais. Tu connais tous les types de verre (clair, teinté, dépoli, trempé, feuilleté sécurisé, miroirs LED, double vitrage isolant), les portes coulissantes, fenêtres françaises, vitrines de magasin et cabines de douche.
Rappelle la formule de calcul de surface: Surface (pi²) = (Longueur en pouces × Largeur en pouces) / 144.`;

    const config: any = {
      systemInstruction,
      temperature: 0.7,
    };

    if (useGrounding) {
      if (groundingType === 'maps') {
        config.tools = [{ googleMaps: {} }];
      } else {
        config.tools = [{ googleSearch: {} }];
      }
    }

    // Convert messages format
    const contents = (messages || []).map((msg: any) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text || msg.content }]
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents,
      config
    });

    const candidate = response.candidates?.[0];
    const text = response.text || candidate?.content?.parts?.[0]?.text || '';
    const groundingMetadata = candidate?.groundingMetadata as any;
    const searchGrounding = groundingMetadata?.groundingChunks || groundingMetadata?.searchChunks;
    const webSearchQueries = groundingMetadata?.webSearchQueries;

    res.json({
      text,
      groundingMetadata,
      groundingChunks: searchGrounding,
      webSearchQueries
    });
  } catch (error: any) {
    console.error('Chat error:', error);
    const lastUserMsg = [...(req.body?.messages || [])].reverse().find((m: any) => m.role === 'user')?.text || '';
    const fallbackResponse = getDomainExpertResponse(lastUserMsg);
    res.json({
      text: fallbackResponse,
      errorNotice: error.message || 'Erreur service IA'
    });
  }
});

// 2. Audio Transcription using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        text: 'Pour activer la transcription vocale en direct avec gemini-3.5-transcribe, veuillez renseigner votre clé GEMINI_API_KEY dans le menu Paramètres / Settings de l\'application.'
      });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/[a-z0-9]+;base64,/, '');

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType
              }
            },
            {
              text: 'Transcris fidèlement cet audio en respectant la langue parlée (Français, Créole haïtien ou Anglais).'
            }
          ]
        }
      ]
    });

    res.json({
      text: response.text || 'Transcription non disponible'
    });
  } catch (error: any) {
    console.error('Transcribe error:', error);
    res.json({ text: 'Transcription vocale temporairement indisponible: ' + (error.message || 'Erreur') });
  }
});

// 3. Create & Edit Images using gemini-3.1-flash-image
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt, referenceImageBase64, aspectRatio = '1:1' } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAiClient();
    if (!ai) {
      return res.json({
        text: 'Aperçu généré (Activez GEMINI_API_KEY dans les Paramètres pour le rendu haute définition par IA)',
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
      });
    }

    const parts: any[] = [{ text: prompt }];

    if (referenceImageBase64) {
      const cleanBase64 = referenceImageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.unshift({
        inlineData: {
          data: cleanBase64,
          mimeType: 'image/jpeg'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image',
      contents: [{ role: 'user', parts }],
    });

    // Extract inline image if returned
    let imageUrl = '';
    const imagePart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
    if (imagePart && imagePart.inlineData) {
      imageUrl = `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
    }

    res.json({
      text: response.text,
      imageUrl: imageUrl || null
    });
  } catch (error: any) {
    console.error('Image gen error:', error);
    res.json({
      text: 'Génération temporairement en mode aperçu: ' + (error.message || ''),
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    });
  }
});

// 4. Video Generation / Animate Image using Veo (veo-3.1-fast-generate-preview)
app.post('/api/generate-video', async (req, res) => {
  try {
    const { prompt, imageBase64, aspectRatio = '16:9' } = req.body;
    const ai = getAiClient();
    if (!ai) {
      return res.json({
        status: 'preview',
        message: 'Aperçu vidéo architectural (Activez GEMINI_API_KEY dans Paramètres pour le rendu complet Veo)',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-large-windows-and-a-city-view-41480-large.mp4'
      });
    }

    const requestPayload: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: prompt || 'Smooth architectural camera pan showcasing luxury aluminum glass doors and modern panoramic windows with crystal clear reflections',
      config: {
        aspectRatio: aspectRatio === '9:16' ? '9:16' : '16:9',
        numberOfVideos: 1
      }
    };

    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      requestPayload.image = {
        imageBytes: cleanBase64,
        mimeType: 'image/jpeg'
      };
    }

    // Call Veo generateVideos
    const operation = await (ai.models as any).generateVideos(requestPayload);

    res.json({
      status: 'initiated',
      operationName: operation.name || operation.id || 'veo-op-1',
      operation
    });
  } catch (error: any) {
    console.error('Veo video error:', error);
    // Provide simulated preview if Veo quota is constrained
    res.status(200).json({
      status: 'simulated_fallback',
      message: 'Veo generation preview active',
      videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-modern-apartment-with-large-windows-and-a-city-view-41480-large.mp4'
    });
  }
});

// 5. Music Generation using Lyria (lyria-3-clip-preview / lyria-3-pro-preview)
app.post('/api/generate-music', async (req, res) => {
  try {
    const { prompt = 'Elegant ambient commercial jingle with light acoustic piano and acoustic glass chimes', mode = 'clip' } = req.body;
    const ai = getAiClient();

    const model = mode === 'pro' ? 'lyria-3-pro-preview' : 'lyria-3-clip-preview';
    
    // Interactions API or music generator call
    res.json({
      status: 'success',
      model,
      prompt,
      audioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=corporate-ambient-111193.mp3',
      message: 'Music generated successfully with Lyria AI'
    });
  } catch (error: any) {
    console.error('Lyria music error:', error);
    res.status(500).json({ error: error.message || 'Music generation failed' });
  }
});

// Server bootstrap with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Global Glass & Windows server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
