export interface Question {
   question: string;
   options: string[];
   correctAnswer: number;
   mapLink: string;
   accessCode: string;
}

export interface QuestionsData {
   "oozma-kappa": Question[];
   "roar-omega-roar": Question[];
   "eta-hiss-hiss": Question[];
   pnk: Question[];
}
