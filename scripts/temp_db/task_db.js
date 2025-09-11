export let currentTask = null;
export let currentTaskKey = "";

export const categories = ["User Story", "Technical Task"];

export let tasks = {};

export function tasksSetter(value){
  tasks = value;
}