const detectAndFixStructure = (jsonString: string): string => {
    try {
      // Stack to keep track of open braces, brackets, and string status
      const stack: string[] = [];
      // Dictionary to map opening symbols to their corresponding closing symbols
      const symbolPairs: { [key: string]: string } = { '{': '}', '[': ']' };
      // Variable to track whether we are inside a string
      let inString: boolean = false;
      // Variable to track escaping within strings
      let escaping: boolean = false;
  
      for (const char of jsonString) {
        if (char === '"' && !escaping) {
          // Toggle inString status on unescaped quotes
          inString = !inString;
        } else if (char === '\\' && inString) {
          // Handle escaping status if inside a string
          escaping = true; // Mark as escaping
        } else if (escaping) {
          // If previously marked as escaping, unmark it (handles consecutive backslashes)
          escaping = false;
        }
  
        if (!inString) {
          // Process braces and brackets only if not inside a string
          if (Object.keys(symbolPairs).includes(char)) {
            // If it's an opening symbol, push to stack
            stack.push(char);
          } else if (Object.values(symbolPairs).includes(char)) {
            // If it's a closing symbol
            if (stack.length > 0 && symbolPairs[stack[stack.length - 1]] === char) {
              // If last open symbol matches the closing symbol
              stack.pop(); // Pop it as it's a valid pair
            }
          }
        }
      }
  
      // Close the unclosed string if any
      if (inString) {
        jsonString += '"';
      }
  
      // After processing all characters, add missing closing symbols for any unclosed structures
      while (stack.length > 0) {
        const closingSymbol = symbolPairs[stack.pop() as keyof typeof symbolPairs]; // Pop the last open symbol and append its closing symbol
        jsonString += closingSymbol;
      }
  
      return jsonString;
    } catch (e) {
      throw new Error(`An error occurred while trying to fix the JSON structure: ${e}`);
    }
  };
  
  const marker = {
    quizStart: '[quiz start]',
    quizEnd: '[quiz end]',
    easyActionStart: '[easy action start]',
    easyActionEnd: '[easy action end]',
    codeAreaStart: '[coding area start]',
    codeAreaEnd: '[coding area end]',
    lessonCompleted: '[LessonComplete',
    resourceStart: '[resource start]',
    resourceEnd: '[resource end]',
  };
  
  const fixMarker = (message: any) => {
    if (message.includes(marker.quizStart) && !message.includes(`#-#-#${marker.quizStart}`)) {
      message = message.replaceAll(marker.quizStart, `#-#-#${marker.quizStart}`);
    }
    if (message.includes(marker.easyActionStart) && !message.includes(`#-#-#${marker.easyActionStart}`)) {
      message = message.replaceAll(marker.easyActionStart, `#-#-#${marker.easyActionStart}`);
    }
    if (message.includes(marker.codeAreaStart) && !message.includes(`#-#-#${marker.codeAreaStart}`)) {
      message = message.replaceAll(marker.codeAreaStart, `#-#-#${marker.codeAreaStart}`);
    }
    if (message.includes(marker.resourceStart) && !message.includes(`#-#-#${marker.resourceStart}`)) {
      message = message.replaceAll(marker.resourceStart, `#-#-#${marker.resourceStart}`);
    }
    if (message.includes(marker.lessonCompleted) && !message.includes(`#-#-#${marker.lessonCompleted}`)) {
      message = message.replaceAll(marker.lessonCompleted, `#-#-#${marker.lessonCompleted}`);
    }
    if (message.includes(marker.quizEnd) && !message.includes(`${marker.quizEnd}#-#-#`)) {
      message = message.replaceAll(marker.quizEnd, `${marker.quizEnd}#-#-#`);
    }
    if (message.includes(marker.easyActionEnd) && !message.includes(`${marker.easyActionEnd}#-#-#`)) {
      message = message.replaceAll(marker.easyActionEnd, `${marker.easyActionEnd}#-#-#`);
    }
    if (message.includes(marker.codeAreaEnd) && !message.includes(`${marker.codeAreaEnd}#-#-#`)) {
      message = message.replaceAll(marker.codeAreaEnd, `${marker.codeAreaEnd}#-#-#`);
    }
    if (message.includes(marker.resourceEnd) && !message.includes(`${marker.resourceEnd}#-#-#`)) {
      message = message.replaceAll(marker.resourceEnd, `${marker.resourceEnd}#-#-#`);
    }
    return message;
  };
  
  const fixSplitter = (conversationData: any) => {
    const newConversationData: any[] = [];
    for (const conversationIndex in conversationData) {
      const messageData = conversationData[conversationIndex];
      const conversationMessage = messageData.content;
      const updatedConversationMessage = fixMarker(conversationMessage);
      newConversationData.push({
        content: updatedConversationMessage,
        role: messageData.role,
        questionId: messageData.questionId,
      });
    }
    return newConversationData;
  };
  
  export { detectAndFixStructure, marker, fixSplitter };
  