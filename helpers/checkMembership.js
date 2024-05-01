const checkMembership = async (ctx, chatIds) => {
    const userId = ctx.from.id;
    let allJoined = true; // Variable to track if user belongs to all channels
  
    try {
        for (const chatId of chatIds) {
            const chatMember = await ctx.telegram.getChatMember(chatId, userId);
            if (
                chatMember.status !== "member" &&
                chatMember.status !== "administrator" &&
                chatMember.status !== "creator"
            ) {
                // If user is not a member of any of the chats, set allJoined to false and break loop
                allJoined = false;
                break;
            }
        }
        // Return result based on allJoined variable
        return { success: true, joined: allJoined };
    } catch (error) {
        console.error("Error checking membership:", error);
        // Check if the error is related to the user not being found
        if (error.code === 400 && error.description === 'Bad Request: user not found') {
            // Handle the case where the user is not found in the chat
            return { success: true, joined: false };
        } else {
            // Handle other errors
            return { success: false, error: 'An error occurred while checking membership' };
        }
    }
  };
  
  module.exports = checkMembership;
  