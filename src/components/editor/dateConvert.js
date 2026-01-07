export function convertText(input, lang) {
    console.log(input, lang)
    if(lang == 1){
        return convertMarkdownText(input);
    }else if(lang == 2){
        return;
    }else if(lang == 3){
        return;
    }
}

function convertMarkdownText(input){
    return input + " mk dayo"
}