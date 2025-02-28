export default {
  data() {
    return {
      userInput: "",
      messages: [{ text: "안녕하세요! 김치 배합에 대해 질문해 주세요.", type: "bot" }],
      isLoading: false,
      openAiApiKey: process.env.VUE_APP_OPENAI_API_KEY, // OpenAI API 키
    };
  },
  methods: {
    async sendMessage() {
      if (!this.userInput.trim() || this.isLoading) return;
      this.messages.push({ text: this.userInput, type: "user" });

      const userMessage = this.userInput;
      this.userInput = "";
      this.isLoading = true;
      this.$nextTick(() => this.scrollToBottom());

      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${this.openAiApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",  // 또는 "gpt-4"
            messages: [{ role: "user", content: userMessage }],
          }),
        });

        const data = await response.json();
        console.log("📌 OpenAI API 응답:", data); // 응답 확인용 로그

        if (data.choices && data.choices.length > 0) {
          this.messages.push({ text: data.choices[0].message.content, type: "bot" });
        } else {
          this.messages.push({ text: "응답을 받을 수 없습니다.", type: "bot" });
        }
      } catch (error) {
        console.error("🚨 API 요청 실패:", error);
        this.messages.push({ text: "오류가 발생했습니다. 다시 시도해주세요.", type: "bot" });
      } finally {
        this.isLoading = false;
        this.$nextTick(() => this.scrollToBottom());
      }
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const chatBody = this.$refs.chatBody;
        if (chatBody) {
          chatBody.scrollTop = chatBody.scrollHeight;
        }
      });
    }
  }
};
