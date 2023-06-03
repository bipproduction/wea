const operatorPatterns: any = {
    Telkomsel: /^08(11|12|13|21|22|23|51|52|53|54|55|56|57|58|59)/,
    XL: /^08(17|18|19|59|77|78|79)/,
    Indosat: /^08(14|15|16|55|56|57|58|59)/,
    Tri: /^08(81|82|83|84|85|86|87|88|89)/,
    Smartfren: /^08(95|96|97|98|99)/,
    Axis: /^08(38|38|38|38|38|38|38|38|38)/,
};

export function filterOperator(phoneNumber: string) {
    for (const operator in operatorPatterns) {
        if (operatorPatterns[operator].test(phoneNumber)) {
            return operator;
        }
    }
    return "Unknown Operator";
}