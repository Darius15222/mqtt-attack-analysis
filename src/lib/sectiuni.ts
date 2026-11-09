// „10.3 Alegerea adâncimii” → „s-10-3”: id-ul titlului de secțiune, la care sare cuprinsul din dreapta paginii.
export const idSectiune = (titlu: string) => 's-' + titlu.split(' ')[0].replace(/\./g, '-')
