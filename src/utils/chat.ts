import { MessageNode } from "@/types/chat";


export const isVisibleMessage = (node: MessageNode) => {
      return node.message &&
        !node.message?.metadata?.is_visually_hidden_from_conversation &&
        node.message?.author?.role !== 'system' &&
        node.message?.content.content_type === 'text' &&
        node.message?.content?.parts[0] !== '';
    }
