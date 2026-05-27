const asyncHandler = require("express-async-handler");
const Chat = require("../models/Chat");

// @desc    Send message to AI and get response
// @route   POST /api/chat
// @access  Private
const chatWithAI = asyncHandler(async (req, res) => {
  const { message, conversationId } = req.body;

  console.log("Chat request received:", {
    message: message?.substring(0, 50),
    conversationId,
    hasGroqKey: !!process.env.GROQ_API_KEY,
  });

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  try {
    let conversation;

    // Get or create conversation
    if (conversationId) {
      conversation = await Chat.findOne({
        _id: conversationId,
        user: req.user._id,
      });
    }

    if (!conversation) {
      conversation = await Chat.create({
        user: req.user._id,
        messages: [],
        title: message.substring(0, 50) + (message.length > 50 ? "..." : ""),
      });
      console.log("Created new conversation:", conversation._id);
    }

    // Save user message
    conversation.messages.push({
      role: "user",
      content: message,
    });

    // System prompt - Defines AI's role
    const systemPrompt = `You are CareerPilot AI, an expert career assistant and mentor for students and job seekers. 

Your role is to help with:
1. **Career Guidance** - Suggest career paths, job roles, industry insights
2. **Coding Help** - Explain concepts, debug code, suggest best practices
3. **Interview Preparation** - Provide questions, tips, strategies
4. **Resume Tips** - Suggest improvements, highlight key skills
5. **Study Plans** - Create learning roadmaps for technologies
6. **Project Ideas** - Suggest portfolio projects based on skill level

Guidelines:
- Be friendly, encouraging, and professional
- Provide practical, actionable advice
- Use examples when explaining concepts
- Keep responses concise but informative (2-3 paragraphs)
- Be specific and helpful
- Do NOT provide harmful or unethical advice

Respond naturally as a helpful career mentor.`;

    let aiResponse = "";
    let usedAI = false;

    // Try to use Groq API if key exists
    if (
      process.env.GROQ_API_KEY &&
      process.env.GROQ_API_KEY !== "your_groq_api_key_here"
    ) {
      try {
        const Groq = require("groq-sdk");
        const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        });

        console.log("Calling Groq API...");

        const completion = await groq.chat.completions.create({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: message },
          ],
          model: "llama-3.1-70b-versatile",
          temperature: 0.7,
          max_tokens: 800,
        });

        aiResponse = completion.choices[0].message.content;
        usedAI = true;
        console.log("Groq API response received, length:", aiResponse.length);
      } catch (groqError) {
        console.error("Groq API error:", groqError.message);
        usedAI = false;
      }
    } else {
      console.log("No Groq API key found, using intelligent mock responses");
    }

    // If Groq failed or no API key, use intelligent mock responses
    if (!usedAI) {
      const lowerMessage = message.toLowerCase();

      // Intelligent mock responses based on keywords
      if (
        lowerMessage.includes("mern") ||
        lowerMessage.includes("full stack")
      ) {
        aiResponse = `🎯 **MERN Stack Learning Roadmap**

Here's a structured 3-month plan to master the MERN stack:

**Month 1 - Fundamentals:**
- JavaScript ES6+ (Promises, Async/Await, Destructuring)
- HTML5 & CSS3 (Flexbox, Grid, Responsive Design)
- Git & GitHub basics

**Month 2 - Frontend:**
- React.js (Components, Hooks, State Management)
- React Router for navigation
- Context API or Redux for state

**Month 3 - Backend & Database:**
- Node.js & Express.js (REST APIs, Middleware)
- MongoDB (CRUD operations, Aggregation)
- JWT Authentication

**Projects to Build:**
1. Todo App with authentication
2. Blog platform with comments
3. E-commerce site with cart

Would you like detailed resources for any of these topics? 🚀`;
      } else if (
        lowerMessage.includes("interview") ||
        lowerMessage.includes("react interview")
      ) {
        aiResponse = `📋 **Common React Interview Questions**

**Beginner Level:**
1. What are React hooks? Explain useState and useEffect.
2. What's the difference between props and state?
3. What is the virtual DOM and how does it work?

**Intermediate Level:**
4. Explain the useEffect cleanup function.
5. What are custom hooks? Create an example.
6. How do you optimize React performance?

**Advanced Level:**
7. Explain React.memo and useCallback.
8. What's the Context API and when to use it?
9. How does React's reconciliation algorithm work?

**Practice Tip:** Build a small app with all these concepts to solidify your understanding.

Would you like me to explain any of these in detail? 💡`;
      } else if (
        lowerMessage.includes("resume") ||
        lowerMessage.includes("cv")
      ) {
        aiResponse = `📄 **Resume Improvement Tips**

**Key Elements for a Strong Resume:**

1. **Professional Summary** (2-3 lines)
   - "Full Stack Developer with 2+ years of experience in MERN stack..."

2. **Technical Skills Section**
   - List technologies with proficiency levels
   - Group by category (Frontend, Backend, Database, Tools)

3. **Projects (with metrics!)**
   - ✅ "Built e-commerce app serving 1000+ users"
   - ❌ "Built an e-commerce app"

4. **Experience Bullet Points**
   - Use action verbs: Developed, Implemented, Optimized, Led
   - Add numbers: "Reduced load time by 40%"

5. **Education & Certifications**

**Quick Wins:**
- Add GitHub and LinkedIn links
- Use ATS-friendly format (no tables/columns)
- Save as PDF with proper name: "YourName_Resume.pdf"

Want me to review your specific resume or suggest projects to add? 📝`;
      } else if (
        lowerMessage.includes("project") ||
        lowerMessage.includes("portfolio")
      ) {
        aiResponse = `💼 **Portfolio Project Ideas by Level**

**Beginner Projects:**
1. **Weather App** - API integration, search functionality
2. **Todo List** - CRUD operations, local storage
3. **Calculator** - Basic arithmetic operations
4. **Portfolio Website** - Personal brand, responsive design

**Intermediate Projects:**
1. **E-commerce Site** - Product listing, cart, checkout
2. **Blog Platform** - User auth, create/edit posts, comments
3. **Task Manager** - Drag-drop, due dates, categories
4. **Chat Application** - Real-time messaging (Socket.io)

**Advanced Projects:**
1. **Social Media Dashboard** - Analytics, data visualization
2. **Video Streaming Platform** - Upload, stream, comments
3. **Job Portal** - Job listings, apply, company profiles
4. **Learning Management System** - Courses, quizzes, progress

**Pro Tip:** Deploy your projects (Vercel/Netlify for frontend, Railway/Render for backend) and add live links to your resume!

Which level interests you? I can provide detailed requirements! 🚀`;
      } else if (
        lowerMessage.includes("python") ||
        lowerMessage.includes("data science")
      ) {
        aiResponse = `🐍 **Python Learning Path for Data Science**

**Phase 1: Python Basics (2-3 weeks)**
- Variables, data types, loops, functions
- List comprehensions, dictionaries
- File handling, error handling

**Phase 2: Data Manipulation (3-4 weeks)**
- NumPy (arrays, mathematical operations)
- Pandas (DataFrames, data cleaning)
- Matplotlib/Seaborn (visualization)

**Phase 3: Statistics & Analysis (2-3 weeks)**
- Descriptive statistics, probability
- Hypothesis testing, correlation
- Exploratory Data Analysis (EDA)

**Phase 4: Machine Learning (4-6 weeks)**
- Scikit-learn (regression, classification)
- Model evaluation, feature engineering
- Basic ML projects

**Resources:**
- Kaggle Datasets for practice
- "Python for Data Analysis" book
- YouTube: Corey Schafer, Sentdex

**Beginner Project:** Analyze a CSV dataset with Pandas and create visualizations

Want a detailed weekly study schedule? 📚`;
      } else if (
        lowerMessage.includes("roadmap") ||
        lowerMessage.includes("learn")
      ) {
        aiResponse = `🗺️ **How to Create an Effective Learning Roadmap**

**Step 1: Set Clear Goals**
- What role? (Frontend, Backend, Full Stack, Data Science)
- Timeline? (3 months, 6 months, 1 year)
- Daily study hours?

**Step 2: Foundational Skills**
- Programming fundamentals
- Version control (Git)
- Problem-solving & algorithms

**Step 3: Core Technologies**
- Pick 1-2 main frameworks (React, Angular, or Vue)
- Backend language (Node.js, Python, or Java)
- Database (MongoDB, PostgreSQL, or MySQL)

**Step 4: Build Projects**
- Apply what you learn immediately
- Start small, then increase complexity
- Create 3-5 portfolio projects

**Step 5: Practice & Network**
- Daily coding (LeetCode, HackerRank)
- Join developer communities
- Contribute to open source

**Recommended Weekly Schedule:**
- 40% Learning (tutorials, courses)
- 40% Building (projects, exercises)
- 20% Review & documentation

Tell me what you want to learn, and I'll create a personalized roadmap! 🎯`;
      } else if (
        lowerMessage.includes("salary") ||
        lowerMessage.includes("job market")
      ) {
        aiResponse = `💰 **Tech Salaries & Job Market Insights (India)**

**Entry Level (0-2 years):**
- Frontend Developer: 4-8 LPA
- Backend Developer: 5-9 LPA  
- Full Stack Developer: 6-10 LPA
- Data Analyst: 4-7 LPA

**Mid Level (2-5 years):**
- Frontend: 8-15 LPA
- Backend: 10-18 LPA
- Full Stack: 12-20 LPA
- Data Scientist: 10-20 LPA

**Senior Level (5+ years):**
- Tech Lead: 20-35 LPA
- Engineering Manager: 25-45 LPA
- Architect: 30-50+ LPA

**High Demand Skills (2024-2025):**
- MERN/MEAN Stack
- Cloud (AWS/Azure/GCP)
- AI/ML Integration
- DevOps (Docker, Kubernetes)
- Cybersecurity

**Tips to Increase Salary:**
- Build strong portfolio with real projects
- Get relevant certifications
- Contribute to open source
- Network on LinkedIn
- Prepare well for DSA interviews

Which role interests you? I can share specific preparation tips! 💪`;
      } else {
        aiResponse = `👋 **Thanks for your question!**

I'm CareerPilot AI, your career assistant. I can help you with:

📚 **Learning & Skills**
- MERN/Full Stack roadmaps
- Python, Data Science guidance
- Project ideas & resources

💼 **Career Advice**
- Job search strategies
- Salary insights
- Company preparation tips

📄 **Resume & Interviews**
- Resume optimization
- Interview questions & answers
- Mock interview tips

🎯 **Study Planning**
- Personalized learning paths
- Time management strategies
- Goal setting guidance

**What would you like to explore today?** 

You can ask me things like:
- "How to learn MERN stack in 3 months?"
- "Common React interview questions"
- "How to improve my resume?"
- "Best portfolio projects for beginners"
- "Python learning roadmap"

Just type your question, and I'll give you detailed, actionable advice! 🚀`;
      }
    }

    // Save AI response
    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await conversation.save();
    console.log(
      "Conversation saved, total messages:",
      conversation.messages.length,
    );

    res.status(200).json({
      success: true,
      reply: aiResponse,
      conversationId: conversation._id,
      messageCount: conversation.messages.length,
      usedAI: usedAI ? "groq" : "mock",
    });
  } catch (error) {
    console.error("Chat API Error:", error.message);
    console.error("Stack:", error.stack);
    res.status(500);
    throw new Error(error.message || "Failed to get AI response");
  }
});

// @desc    Get user's chat history
// @route   GET /api/chat/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const conversations = await Chat.find({ user: req.user._id }).sort({
    updatedAt: -1,
  });

  const conversationsWithCount = conversations.map((conv) => ({
    _id: conv._id,
    title: conv.title,
    createdAt: conv.createdAt,
    updatedAt: conv.updatedAt,
    messageCount: conv.messages ? conv.messages.length : 0,
  }));

  res.status(200).json(conversationsWithCount);
});

// @desc    Get single conversation
// @route   GET /api/chat/:id
// @access  Private
const getConversation = asyncHandler(async (req, res) => {
  const conversation = await Chat.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  res.status(200).json(conversation);
});

// @desc    Delete conversation
// @route   DELETE /api/chat/:id
// @access  Private
const deleteConversation = asyncHandler(async (req, res) => {
  const conversation = await Chat.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!conversation) {
    res.status(404);
    throw new Error("Conversation not found");
  }

  await conversation.deleteOne();
  res.status(200).json({ message: "Conversation deleted" });
});

// @desc    Clear all conversations
// @route   DELETE /api/chat
// @access  Private
const clearAllConversations = asyncHandler(async (req, res) => {
  await Chat.deleteMany({ user: req.user._id });
  res.status(200).json({ message: "All conversations cleared" });
});

module.exports = {
  chatWithAI,
  getChatHistory,
  getConversation,
  deleteConversation,
  clearAllConversations,
};
