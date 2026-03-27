/**
 * MBTI 人格类型接口定义
 */

export type MBTIType =
  | 'ISTJ' | 'ISFJ' | 'INFJ' | 'INTJ'
  | 'ISTP' | 'ISFP' | 'INFP' | 'INTP'
  | 'ESTP' | 'ESFP' | 'ENFP' | 'ENTP'
  | 'ESTJ' | 'ESFJ' | 'ENFJ' | 'ENTJ';

export interface PersonalityType {
  type: MBTIType;
  name: string;
  nickname: string;
  description: string;
  traits: string[];
  strengths: string[];
  weaknesses: string[];
  careers: string[];
  relationships: string;
  color: string;
  gradient: string;
}

export interface TestQuestion {
  id: number;
  question: string;
  dimension: 'EI' | 'SN' | 'TF' | 'JP';
  direction: 'first' | 'second';
  firstOption: string;
  secondOption: string;
}

export interface TestResult {
  type: MBTIType;
  scores: {
    E: number;
    I: number;
    S: number;
    N: number;
    T: number;
    F: number;
    J: number;
    P: number;
  };
}

export interface TestHistoryItem extends TestResult {
  id: string;
  timestamp: number;
}

export interface LikertOption {
  value: number;
  label: string;
  description: string;
}
