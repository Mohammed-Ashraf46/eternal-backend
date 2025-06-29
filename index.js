const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Character name mapping for file names
const characterFileMap = {
  'صلاح الدين الأيوبي': 'saladin',
  'ابن سينا': 'ibn-sina',
  'كليوباترا': 'cleopatra',
  'الإسكندر الأكبر': 'alexander',
  'ألبرت أينشتاين': 'einstein',
  'أحمد زويل': 'ahmed-zewail'
};

// Function to load prompt from file
const loadPrompt = (characterName) => {
  try {
    const fileName = characterFileMap[characterName] || 'default';
    const promptPath = path.join(__dirname, 'prompts', `${fileName}.txt`);
    
    if (fs.existsSync(promptPath)) {
      return fs.readFileSync(promptPath, 'utf8');
    } else {
      // Fallback to default prompt if character file doesn't exist
      const defaultPath = path.join(__dirname, 'prompts', 'default.txt');
      if (fs.existsSync(defaultPath)) {
        return fs.readFileSync(defaultPath, 'utf8');
      } else {
        return `أنت ${characterName}، شخصية تاريخية مهمة. أجب على الأسئلة بطريقة تعكس شخصيتك وخبرتك التاريخية.`;
      }
    }
  } catch (error) {
    console.error('Error loading prompt:', error);
    return `أنت ${characterName}، شخصية تاريخية مهمة. أجب على الأسئلة بطريقة تعكس شخصيتك وخبرتك التاريخية.`;
  }
};

// Function to generate mock response for testing
const generateMockResponse = (character, message) => {
  const responses = {
    'صلاح الدين الأيوبي': [
      'السلام عليكم ورحمة الله وبركاته. أنا صلاح الدين الأيوبي، بفضل الله تعالى استطعت تحرير القدس من الصليبيين. كيف يمكنني مساعدتك اليوم؟',
      'من خبرتي في القيادة والجهاد، أعتقد أن الصبر والحكمة هما أساس النجاح في أي معركة. العدالة والرحمة أقوى من السيف أحياناً.',
      'القائد الحقيقي هو من يحمي شعبه ويدافع عن أرضه بشرف وكرامة. الوحدة والإيمان هما سر قوة المسلمين في مواجهة أي تحدٍ.'
    ],
    'ابن سينا': [
      'مرحباً بك في عالم العلم والمعرفة. أنا ابن سينا، الطبيب والفيلسوف. من دراستي للطب والفلسفة، أرى أن العقل والعلم هما طريق التقدم الحقيقي.',
      'الصحة الجسدية والنفسية مترابطتان، كما ذكرت في كتاب القانون في الطب. البحث والتجريب هما أساس الوصول للحقيقة العلمية.',
      'الحكمة تأتي من الجمع بين النقل والعقل، وليس من أحدهما فقط. الطبيب الحقيقي يعالج الروح قبل الجسد.'
    ],
    'كليوباترا': [
      'أهلاً وسهلاً بك في مملكة مصر العظيمة. أنا كليوباترا السابعة، آخر ملكات البطالمة. من خبرتي في حكم مصر، أعلم أن الدبلوماسية أقوى من الحرب أحياناً.',
      'المرأة القوية تستطيع أن تقود الأمم وتحافظ على حضارتها عبر التاريخ. مصر أرض الحضارة والعلم، وهذا ما جعلها قوية عبر آلاف السنين.',
      'الذكاء والجمال سلاحان قويان في يد الحاكم الحكيم. الحضارة الحقيقية تُقاس بما تتركه للأجيال القادمة.'
    ],
    'الإسكندر الأكبر': [
      'مرحباً أيها المحارب! أنا الإسكندر الأكبر، ملك مقدونيا وفاتح العالم. من فتوحاتي الواسعة، تعلمت أن الشجاعة والتخطيط يصنعان المعجزات.',
      'القائد العظيم هو من يلهم جنوده ويقودهم للنصر بالقدوة. الحضارات تنتشر بالعلم والثقافة، ليس بالسيف فقط.',
      'الطموح بلا حدود هو ما يميز العظماء عن غيرهم. أعظم الانتصارات هي التي تحقق بدون إراقة دماء.'
    ],
    'ألبرت أينشتاين': [
      'مرحباً بك في عالم العلم والاكتشاف! أنا ألبرت أينشتاين. من نظرية النسبية، تعلمت أن كل شيء نسبي إلا سرعة الضوء والحقيقة.',
      'الخيال أهم من المعرفة، فالمعرفة محدودة والخيال لا نهائي. العلم بدون دين أعرج، والدين بدون علم أعمى.',
      'أهم شيء هو ألا تتوقف عن طرح الأسئلة والبحث عن الإجابات. السلام لا يمكن أن يُحفظ بالقوة، بل بالتفاهم المتبادل.'
    ],
    'أحمد زويل': [
      'أهلاً بك في مختبر العلم! أنا أحمد زويل، عالم الكيمياء المصري الحائز على نوبل. من أبحاثي في الكيمياء، اكتشفت أن الزمن يمكن قياسه بالفيمتو ثانية.',
      'العلم لا يعرف الحدود الجغرافية، والمعرفة ملك للإنسانية جمعاء. التعليم والبحث العلمي هما أساس تقدم الأمم ونهضتها.',
      'الحلم والعمل الجاد يحققان المستحيل، كما فعلت في نوبل. مصر قادرة على إنتاج علماء عظماء إذا استثمرنا في التعليم.'
    ]
  };

  const characterResponses = responses[character] || [
    `أهلاً وسهلاً بك! أنا ${character}. سعيد بلقائك وأتطلع للحديث معك.`,
    `مرحباً! كوني ${character}، لدي الكثير لأشاركه معك من تجاربي وخبراتي.`,
    `أهلاً بك! أنا ${character} وأسعد بالحديث معك حول أي موضوع تريد مناقشته.`
  ];

  return characterResponses[Math.floor(Math.random() * characterResponses.length)];
};

// API endpoint for chat messages
app.post('/api/message', async (req, res) => {
  try {
    const { message, character } = req.body;

    // Validate input
    if (!message || !character) {
      return res.status(400).json({
        error: 'Missing required fields: message and character'
      });
    }

    // Check if Gemini API key is available and valid
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.log('Using mock response - Gemini API key not configured');
      return res.json({
        reply: generateMockResponse(character, message),
        character: character,
        timestamp: new Date().toISOString(),
        source: 'mock'
      });
    }

    // Load character prompt
    const systemPrompt = loadPrompt(character);

    // Prepare Gemini API request
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: `${systemPrompt}\n\nUser: ${message}\nAssistant:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 1000,
        topP: 0.8,
        topK: 10
      }
    };

    // Send request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      geminiRequest,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract reply from response
    const reply = response.data.candidates[0].content.parts[0].text;

    // Send response
    res.json({
      reply: reply,
      character: character,
      timestamp: new Date().toISOString(),
      source: 'gemini'
    });

  } catch (error) {
    console.error('Error processing message:', error);

    // Handle different types of errors
    if (error.response) {
      // API error - use mock response as fallback
      if (error.response.status === 400 || error.response.status === 403) {
        console.log('Gemini API error - using mock response');
        return res.json({
          reply: generateMockResponse(req.body.character, req.body.message),
          character: req.body.character,
          timestamp: new Date().toISOString(),
          source: 'mock_fallback',
          note: 'Gemini API error - using mock response'
        });
      }

      res.status(error.response.status).json({
        error: 'API Error',
        message: error.response.data?.error?.message || 'Unknown API error',
        fallback_reply: generateMockResponse(req.body.character, req.body.message)
      });
    } else if (error.request) {
      // Network error - use mock response as fallback
      console.log('Network error - using mock response');
      res.json({
        reply: generateMockResponse(req.body.character, req.body.message),
        character: req.body.character,
        timestamp: new Date().toISOString(),
        source: 'mock_fallback',
        note: 'Network error - using mock response'
      });
    } else {
      // Other error - use mock response as fallback
      console.log('Other error - using mock response');
      res.json({
        reply: generateMockResponse(req.body.character, req.body.message),
        character: req.body.character,
        timestamp: new Date().toISOString(),
        source: 'mock_fallback',
        note: 'Server error - using mock response'
      });
    }
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'Eternal Chat Backend'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Eternal Chat Backend API',
    version: '1.0.0',
    endpoints: {
      'POST /api/message': 'Send a message to a character',
      'GET /health': 'Health check'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/health`);
});

module.exports = app;
