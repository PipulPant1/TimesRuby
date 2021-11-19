/// <reference types="cypress" />
export const logger = (className) => {
    return new Proxy(new className(), {
        get: function (target, name, receiver) {
            if (!target.hasOwnProperty(name)) {
                if (typeof target[name] === 'function') {
                    cy.PomLog(target.constructor.name, name)
                }
                return new Proxy(target[name], this)
            }
            return Reflect.get(target, name, receiver)
        },
    })
}

//Old Method
function logFactory(func, className) {
    return function () {
        // console.log(`${func.name}() || pom/${className}.js`)
        cy.PomLog(className, func.name)
        return func.apply(this, arguments)
    }
}

const getMethods = (obj) => {
    let properties = new Set()
    let currentObj = obj
    do {
        Object.getOwnPropertyNames(currentObj).map((item) =>
            properties.add(item)
        )
    } while ((currentObj = Object.getPrototypeOf(currentObj)))
    return [...properties.keys()].filter(
        (item) => typeof obj[item] === 'function'
    )
}

const oldLogger = (className) => {
    let instance = new className()
    let arrayOfMethods = getMethods(instance)
    arrayOfMethods.forEach((method) => {
        instance[method] = logFactory(instance[method], className.name)
    })
    return instance
}
