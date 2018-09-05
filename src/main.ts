import './assets/styles/styles.scss';
import {  Hero } from './test'

function getName(name: String) {
    return name;
}

console.log(getName('Simple function log'));

let hero = new Hero('Simple Blog');
console.log(hero.myName());
