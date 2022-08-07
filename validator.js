// import { handleValidate } from "./handleValidate";

// đối tượng Validator
export function Validator(formSelector) {
    var _this = this;
    // khởi tạo obj rỗng chứa các rules của form
    var formRules = {};

    // lấy ra thẻ cha của element hiện tại (tức là currentElement)
    function getParent(currentElement, selector) {
        while (currentElement.parentElement) {
            if (currentElement.parentElement.matches(selector)) {
              return currentElement.parentElement;
            }
      
            currentElement = currentElement.parentElement;
        }
    };

    

    // định nghĩa các rules
    /**
     * Quy ước tạo rules:
     * - Nếu có lỗi thì return `errorMessage`
     * - Nếu không có lỗi thì return `undefined`
     */
    var validatorRules = {
        required: (value) => {
            return value ? undefined : `Vui lòng nhập trường này!`;
        },
        email: (value) => {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

            return regex.test(value) ? undefined : `Trường này phải là email!`;
        },
        min: (min) => {
            return (value) => {
                return value.length >= min ? undefined : `Vui lòng nhập tối thiểu ${min} ký tự!`;
            }
        },
        max: (max) => {
            return (value) => {
                return value.length <= max ? undefined : `Vui lòng nhập tối đa ${max} ký tự!`;
            }
        },
    }

    // lấy ra  form element trong DOM theo `formSelector`
    var formElement = document.querySelector(formSelector);
    
    // kiểm tra và chỉ xử lý khi có element trong DOM
    if (formElement) {
        var inputs = formElement.querySelectorAll('[name][rules]');

        for (var input of inputs) {
            // tách riêng các rule bị ngăn cách bởi dấu "|" và gán vào biến rules
            var rules = input.getAttribute('rules').split('|');

            // tách rule khỏi rules
            for (var rule of rules) {
                
                var ruleInfo;
                // gán rule có bao gồm dấu ':' vào biến isRuleHasValue
                var isRuleHasValue = rule.includes(':');
                // tách riêng các rule bị ngăn cách bởi dấu ":" (của trường hợp rule min hoặc max)
                if (isRuleHasValue) {
                    ruleInfo = rule.split(':');
                    rule = ruleInfo[0];
                }

                // console.log(rule);
                var ruleFunc = validatorRules[rule];

                if (isRuleHasValue) {
                    ruleFunc = ruleFunc(ruleInfo[1]);
                }

                /**
                 * lần đầu tiên lặp, điều kiện formRules có phải là Array không chắc chắn sẽ sai
                 * vì formRules vốn là một obj rỗng
                 * => vòng lặp đầu tiên sẽ rơi vào else
                 * 
                 * sau lần lặp đầu, formRules lúc này đã là Array
                 * => từ vòng lặp thứ hai, điều kiện if sẽ đúng
                 * => thay vì gán, ta dùng method push()
                 */
                if (Array.isArray(formRules[input.name])) {
                    formRules[input.name].push(ruleFunc);
                } 
                /**
                 * vòng lặp đầu tiên rơi vào else, nhanh trí gán cho obj formRules bằng Array,
                 * và giá trị đầu tiên của formRules (lúc bấy giờ đã trở thành Array) sẽ là function rule
                 */
                else {
                    formRules[input.name] = [ruleFunc];
                }
            }

            // lắng nghe sự kiện để validate (blur, change, ...)
            input.onblur = handleValidate;
            // input.onchange = handleChange;
            input.oninput = handleClearError;
        }

        function handleValidate(event) {
            var rules = formRules[event.target.name];
            // console.log(rules);
            var errorMessage;

            for (var rule of rules) {
                errorMessage = rule(event.target.value);
                if (errorMessage) break;
            }

            // console.log(errorMessage);

            // nếu có lỗi => hiển thị ra UI
            if (errorMessage) {
                var currentElement = event.target;
                var formGroup = getParent(currentElement, '.form-group');

                if (formGroup) {
                    formGroup.classList.add('invalid');
                    var formMessage = formGroup.querySelector('.form-message');

                    if (formMessage) {
                        formMessage.innerText = errorMessage;
                    }
                }
            }

            return !errorMessage;
        };

        function handleClearError(event) {
            var currentElement = event.target;
            var formGroup = getParent(currentElement, '.form-group');

            if (formGroup.classList.contains('invalid')) {
                formGroup.classList.remove('invalid');
                var formMessage = formGroup.querySelector('.form-message');

                if (formMessage) {
                    formMessage.innerText = '';
                }
            }
        };



        // xử lý hành vi submit form
        formElement.onsubmit = function (event) {
            event.preventDefault();

            // _this.onSubmit();

            var inputs = formElement.querySelectorAll('[name][rules]');
            var isValid = true;

            for (var input of inputs) {
                if (!handleValidate({ target: input })) {
                    isValid = false;
                }
                
            } 

            // khi không có lỗi thì submit form
            if (isValid) {
                // trường hợp muốn call API
                if (typeof _this.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]:not([disable])');

                    var formValues = Array.from(enableInputs).reduce((values, input) => {
                        switch(input.type) {
                        case 'radio':
                            values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                            break;
                        case 'checkbox':  
                            if (!input.matches(':checked')) {
                            // values[input.name] = '';
                            return values;
                            }
                            
                            if (!Array.isArray(values[input.name])) {
                            values[input.name] = [];
                            }

                            values[input.name].push(input.value);
                            break;
                        case 'file':
                            values[input.name] = input.files;
                            break;
                        default:
                            values[input.name] = input.value;
                        }

                        return values;
                    }, {});

                    // gọi lại function onSubmit và return data (tức là value của form)
                    _this.onSubmit(formValues); 
                } 
                // trường hợp submit theo hành vi mặc định
                else {
                    formElement.submit();
                }
            }
        }
    }
}
