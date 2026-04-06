export interface Database {
  public: {
    Tables: {
      sessions: {
        Row: {
          id: string;
          created_at: string;
          selfie_url: string | null;
          status: "pending" | "analyzing" | "generating" | "completed" | "failed";
          platform: "tinder" | "hinge" | "both";
          gender: string | null;
          style_preference: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          selfie_url?: string | null;
          status?: "pending" | "analyzing" | "generating" | "completed" | "failed";
          platform?: "tinder" | "hinge" | "both";
          gender?: string | null;
          style_preference?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          selfie_url?: string | null;
          status?: "pending" | "analyzing" | "generating" | "completed" | "failed";
          platform?: "tinder" | "hinge" | "both";
          gender?: string | null;
          style_preference?: string | null;
        };
      };
      generated_photos: {
        Row: {
          id: string;
          session_id: string;
          prompt: string;
          image_url: string | null;
          scene_type: string;
          status: "pending" | "generating" | "completed" | "failed";
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id: string;
          prompt: string;
          image_url?: string | null;
          scene_type: string;
          status?: "pending" | "generating" | "completed" | "failed";
          sort_order: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          prompt?: string;
          image_url?: string | null;
          scene_type?: string;
          status?: "pending" | "generating" | "completed" | "failed";
          sort_order?: number;
          created_at?: string;
        };
      };
    };
  };
}

export type Session = Database["public"]["Tables"]["sessions"]["Row"];
export type GeneratedPhoto = Database["public"]["Tables"]["generated_photos"]["Row"];
