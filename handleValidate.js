// import { Validator } from './app.js';

// export function handleValidate(event) {
//     var rules = formRules[event.target.name];
//     // console.log(rules);
//     var errorMessage;

//     rules.find((rule) => {
//         errorMessage = rule(event.target.value);
//         return errorMessage;
//     });

//     console.log(errorMessage);

//     // nếu có lỗi => hiển thị ra UI
//     if (errorMessage) {
//         var currentElement = event.target;
//         var formGroup = getParent(currentElement, '.form-group');

//         if (formGroup) {
//             formGroup.classList.add('invalid');
//             var formMessage = formGroup.querySelector('.form-message');

//             if (formMessage) {
//                 formMessage.innerText = errorMessage;
//             }
//         }
//     }
// };