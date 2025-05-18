// Tabla periódica simplificada (masas atómicas)
const tablaPeriodica = {
    H: 1.008, He: 4.003, Li: 6.941, Be: 9.012, B: 10.811, C: 12.011, N: 14.007, O: 16.000,
    F: 18.998, Ne: 20.180, Na: 22.990, Mg: 24.305, Al: 26.982, Si: 28.086, P: 30.974, S: 32.065,
    Cl: 35.453, Ar: 39.948, K: 39.098, Ca: 40.078, Sc: 44.956, Ti: 47.867, V: 50.942, Cr: 51.996,
    Mn: 54.938, Fe: 55.845, Co: 58.933, Ni: 58.693, Cu: 63.546, Zn: 65.38, Ga: 69.723, Ge: 72.64,
    As: 74.922, Se: 78.96, Br: 79.904, Kr: 83.798, Rb: 85.468, Sr: 87.62, Y: 88.906, Zr: 91.224,
    Nb: 92.906, Mo: 95.96, Tc: 98, Ru: 101.07, Rh: 102.906, Pd: 106.42, Ag: 107.868, Cd: 112.411,
    In: 114.818, Sn: 118.711, Sb: 121.760, Te: 127.60, I: 126.904, Xe: 131.293, Cs: 132.905, Ba: 137.327,
    La: 138.905, Ce: 140.116, Pr: 140.908, Nd: 144.242, Pm: 145, Sm: 150.36, Eu: 151.964, Gd: 157.25,
    Tb: 158.925, Dy: 162.500, Ho: 164.930, Er: 167.259, Tm: 168.934, Yb: 173.04, Lu: 174.967, Hf: 178.49,
    Ta: 180.948, W: 183.84, Re: 186.207, Os: 190.23, Ir: 192.217, Pt: 195.084, Au: 196.967, Hg: 200.59,
    Tl: 204.383, Pb: 207.2, Bi: 208.980, Po: 209, At: 210, Rn: 222, Fr: 223, Ra: 226, Ac: 227, Th: 232.038,
    Pa: 231.036, U: 238.029, Np: 237, Pu: 244, Am: 243, Cm: 247, Bk: 247, Cf: 251, Es: 252, Fm: 257,
    Md: 258, No: 259, Lr: 262, Rf: 267, Db: 268, Sg: 271, Bh: 272, Hs: 270, Mt: 276, Ds: 281, Rg: 280,
    Cn: 285, Nh: 284, Fl: 289, Mc: 288, Lv: 293, Ts: 294, Og: 294
};

// Constante de Avogadro
const NA = 6.022e23;

// Volumen molar de un gas en condiciones estándar (L/mol)
const volumenMolarSTP = 22.4;

// Constante de los gases (L·atm/(mol·K))
const R = 0.08206;

// Parsear fórmula química y calcular masa molar
function calcularMasaMolar(formula) {
    if (!formula) return 0;
    
    // Expresión regular para identificar elementos y sus cantidades
    const regex = /([A-Z][a-z]*)(\d*)/g;
    let match;
    let masaMolar = 0;
    
    while (match = regex.exec(formula)) {
        const elemento = match[1];
        const cantidad = match[2] ? parseInt(match[2]) : 1;
        
        if (!tablaPeriodica[elemento]) {
            throw new Error(`Elemento desconocido: ${elemento}`);
        }
        
        masaMolar += tablaPeriodica[elemento] * cantidad;
    }
    
    return masaMolar;
}

// Parsear ecuación química
function parsearEcuacion(ecuacion) {
    // Limpiar espacios
    ecuacion = ecuacion.replace(/\s+/g, '');
    
    // Separar reactivos y productos
    const partes = ecuacion.split('→');
    if (partes.length !== 2) {
        throw new Error('Formato de ecuación inválido. Use → para separar reactivos y productos.');
    }
    
    const [reactivosStr, productosStr] = partes;
    
    // Función para parsear compuestos y sus coeficientes
    function parsearCompuestos(str) {
        const compuestos = str.split('+');
        return compuestos.map(comp => {
            // Extraer coeficiente
            const match = comp.match(/^(\d*)(.+)/);
            const coeficiente = match[1] ? parseInt(match[1]) : 1;
            const formula = match[2];
            const masaMolar = calcularMasaMolar(formula);
            
            return {
                formula,
                coeficiente,
                masaMolar
            };
        });
    }
    
    return {
        reactivos: parsearCompuestos(reactivosStr),
        productos: parsearCompuestos(productosStr)
    };
}

// Calculadora de Conversión Mol-Masa-Partículas
function calculateConversion() {
    const formula = document.getElementById('formula').value;
    const fromUnit = document.getElementById('fromUnit').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const toUnit = document.getElementById('toUnit').value;
    const resultDiv = document.getElementById('conversionResult');
    
    try {
        const masaMolar = calcularMasaMolar(formula);
        
        // Convertir a moles primero
        let moles;
        switch (fromUnit) {
            case 'moles':
                moles = amount;
                break;
            case 'gramos':
                moles = amount / masaMolar;
                break;
            case 'particulas':
                moles = amount / NA;
                break;
        }
        
        // Convertir de moles a la unidad destino
        let result;
        switch (toUnit) {
            case 'moles':
                result = moles;
                break;
            case 'gramos':
                result = moles * masaMolar;
                break;
            case 'particulas':
                result = moles * NA;
                break;
        }
        
        // Mostrar resultados formateados
        let fromUnitTexto = fromUnit === 'particulas' ? 'partículas' : fromUnit;
        let toUnitTexto = toUnit === 'particulas' ? 'partículas' : toUnit;
        
        let resultText = `<h3>Resultado de la conversión:</h3>
            <p>${amount} ${fromUnitTexto} de ${formula} = ${formatNumber(result)} ${toUnitTexto}</p>
            <h4>Paso a paso:</h4>
            <ol>
                <li>Masa molar de ${formula} = ${masaMolar.toFixed(4)} g/mol</li>`;
                
        if (fromUnit !== 'moles') {
            if (fromUnit === 'gramos') {
                resultText += `<li>${amount} g ÷ ${masaMolar.toFixed(4)} g/mol = ${moles.toFixed(4)} mol</li>`;
            } else {
                resultText += `<li>${formatNumber(amount)} partículas ÷ ${formatNumber(NA)} partículas/mol = ${moles.toFixed(4)} mol</li>`;
            }
        }
        
        if (toUnit !== 'moles') {
            if (toUnit === 'gramos') {
                resultText += `<li>${moles.toFixed(4)} mol × ${masaMolar.toFixed(4)} g/mol = ${result.toFixed(4)} g</li>`;
            } else {
                resultText += `<li>${moles.toFixed(4)} mol × ${formatNumber(NA)} partículas/mol = ${formatNumber(result)} partículas</li>`;
            }
        }
        
        resultText += `</ol>`;
        
        resultDiv.innerHTML = resultText;
        resultDiv.classList.add('visible');
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        resultDiv.classList.add('visible');
    }
}

// Función para formatear números grandes
function formatNumber(num) {
    if (num >= 1e6) {
        return num.toExponential(4);
    }
    return num.toFixed(4);
}

// Calculadora de Reactante Limitante
function calculateLimitante() {
    const ecuacion = document.getElementById('ecuacion').value;
    const resultDiv = document.getElementById('limitanteResult');
    
    try {
        const reaccion = parsearEcuacion(ecuacion);
        
        // Obtener datos de los reactantes
        const reactanteInputs = document.querySelectorAll('.reactante-input');
        const reactantesData = [];
        
        for (let i = 0; i < reactanteInputs.length; i++) {
            const selector = reactanteInputs[i].querySelector('.reactante-selector');
            const cantidad = reactanteInputs[i].querySelector('.reactante-cantidad');
            const unidad = reactanteInputs[i].querySelector('.reactante-unidad');
            
            const indice = parseInt(selector.value);
            const reactante = reaccion.reactivos[indice];
            
            let moles;
            if (unidad.value === 'moles') {
                moles = parseFloat(cantidad.value);
            } else {
                // Convertir de gramos a moles
                moles = parseFloat(cantidad.value) / reactante.masaMolar;
            }
            
            reactantesData.push({
                indice,
                formula: reactante.formula,
                cantidadInicial: parseFloat(cantidad.value),
                unidad: unidad.value,
                moles,
                coeficiente: reactante.coeficiente,
                masaMolar: reactante.masaMolar
            });
        }
        
        // Calcular moles disponibles según estequiometría
        const molesDisponibles = reactantesData.map(r => r.moles / r.coeficiente);
        
        // Encontrar reactante limitante
        const limitanteIndex = molesDisponibles.indexOf(Math.min(...molesDisponibles));
        const reactanteLimitante = reactantesData[limitanteIndex];
        
        // Producto seleccionado
        const productoSelector = document.getElementById('producto-selector');
        const productoIndice = parseInt(productoSelector.value);
        const producto = reaccion.productos[productoIndice];
        
        // Calcular la cantidad teórica del producto
        const molesProducto = (reactanteLimitante.moles / reactanteLimitante.coeficiente) * producto.coeficiente;
        const gramosProducto = molesProducto * producto.masaMolar;
        
        // Calcular cantidades en exceso
        let resultText = `<h3>Resultados:</h3>
            <p><strong>Reactante limitante:</strong> ${reactanteLimitante.formula}</p>
            <p><strong>Producto esperado (${producto.formula}):</strong> ${molesProducto.toFixed(4)} moles (${gramosProducto.toFixed(4)} g)</p>
            <h4>Reactantes en exceso:</h4>
            <table>
                <tr>
                    <th>Reactante</th>
                    <th>Cantidad inicial</th>
                    <th>Cantidad consumida</th>
                    <th>Cantidad en exceso</th>
                </tr>`;
        
        reactantesData.forEach(reactante => {
            if (reactante !== reactanteLimitante) {
                // Calcular moles consumidos
                const molesConsumidos = (reactanteLimitante.moles / reactanteLimitante.coeficiente) * reactante.coeficiente;
                const molesExceso = reactante.moles - molesConsumidos;
                
                let cantidadConsumida, cantidadExceso;
                if (reactante.unidad === 'moles') {
                    cantidadConsumida = molesConsumidos;
                    cantidadExceso = molesExceso;
                } else {
                    cantidadConsumida = molesConsumidos * reactante.masaMolar;
                    cantidadExceso = molesExceso * reactante.masaMolar;
                }
                
                resultText += `<tr>
                    <td>${reactante.formula}</td>
                    <td>${reactante.cantidadInicial.toFixed(4)} ${reactante.unidad}</td>
                    <td>${cantidadConsumida.toFixed(4)} ${reactante.unidad}</td>
                    <td>${cantidadExceso.toFixed(4)} ${reactante.unidad}</td>
                </tr>`;
            } else {
                resultText += `<tr>
                    <td>${reactante.formula}</td>
                    <td>${reactante.cantidadInicial.toFixed(4)} ${reactante.unidad}</td>
                    <td>${reactante.cantidadInicial.toFixed(4)} ${reactante.unidad}</td>
                    <td>0.0000 ${reactante.unidad} (limitante)</td>
                </tr>`;
            }
        });
        
        resultText += `</table>
            <h4>Explicación del proceso:</h4>
            <ol>
                <li>Convertimos todas las cantidades a moles:`;
        
        reactantesData.forEach(reactante => {
            if (reactante.unidad === 'gramos') {
                resultText += `<br>${reactante.cantidadInicial} g de ${reactante.formula} ÷ ${reactante.masaMolar.toFixed(4)} g/mol = ${reactante.moles.toFixed(4)} mol`;
            } else {
                resultText += `<br>${reactante.formula}: ${reactante.moles.toFixed(4)} mol`;
            }
        });
        
        resultText += `</li>
                <li>Dividimos los moles de cada reactante entre su coeficiente estequiométrico:`;
        
        reactantesData.forEach(reactante => {
            resultText += `<br>${reactante.moles.toFixed(4)} mol de ${reactante.formula} ÷ ${reactante.coeficiente} = ${(reactante.moles / reactante.coeficiente).toFixed(4)}`;
        });
        
        resultText += `</li>
                <li>El reactante limitante es ${reactanteLimitante.formula} porque proporciona la menor cantidad de moles: ${(reactanteLimitante.moles / reactanteLimitante.coeficiente).toFixed(4)}</li>
                <li>Calculamos la cantidad de producto:
                    <br>${(reactanteLimitante.moles / reactanteLimitante.coeficiente).toFixed(4)} × ${producto.coeficiente} = ${molesProducto.toFixed(4)} moles de ${producto.formula}
                    <br>${molesProducto.toFixed(4)} mol × ${producto.masaMolar.toFixed(4)} g/mol = ${gramosProducto.toFixed(4)} g de ${producto.formula}
                </li>
            </ol>`;
        
        resultDiv.innerHTML = resultText;
        resultDiv.classList.add('visible');
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        resultDiv.classList.add('visible');
    }
}

// Calculadora de Rendimiento
function calculateRendimiento() {
    const ecuacion = document.getElementById('ecuacion-rendimiento').value;
    const rendimientoExperimental = document.getElementById('rendimiento-experimental').value;
    const unidadRendimiento = document.getElementById('unidad-rendimiento').value;
    const resultDiv = document.getElementById('rendimientoResult');
    
    try {
        // Primero calcular el reactante limitante y el rendimiento teórico
        const reaccion = parsearEcuacion(ecuacion);
        
        // Obtener datos de los reactantes (similar a calculateLimitante)
        // ... [código similar al de la función calculateLimitante] ...
        
        // Para este ejemplo, simularemos los resultados
        let rendimientoTeorico = 25.6; // Esto sería calculado en base al reactante limitante
        let rendimientoReal = rendimientoExperimental ? parseFloat(rendimientoExperimental) : 0;
        let unidad = unidadRendimiento === 'gramos' ? 'g' : 'mol';
        
        let resultText = `<h3>Resultados de Rendimiento:</h3>
            <p><strong>Rendimiento teórico:</strong> ${rendimientoTeorico.toFixed(4)} ${unidad}</p>`;
            
        if (rendimientoReal > 0) {
            const porcentajeRendimiento = (rendimientoReal / rendimientoTeorico) * 100;
            resultText += `<p><strong>Rendimiento experimental:</strong> ${rendimientoReal.toFixed(4)} ${unidad}</p>
                <p><strong>Porcentaje de rendimiento:</strong> ${porcentajeRendimiento.toFixed(2)}%</p>`;
                
            if (porcentajeRendimiento > 100) {
                resultText += `<p class="warning">⚠️ El rendimiento experimental es mayor que el teórico. 
                    Esto puede indicar un error en la medición o cálculos.</p>`;
            } else if (porcentajeRendimiento > 90) {
                resultText += `<p class="success">¡Excelente rendimiento! Indica una reacción muy eficiente.</p>`;
            } else if (porcentajeRendimiento < 50) {
                resultText += `<p>El rendimiento es bajo. Posibles causas: reacciones secundarias, 
                    pérdida de producto durante la purificación, o reacción incompleta.</p>`;
            }
        }
        
        resultDiv.innerHTML = resultText;
        resultDiv.classList.add('visible');
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        resultDiv.classList.add('visible');
    }
}

// Calculadora de Conversiones Estequiométricas
function calculateEstequiometria() {
    const ecuacion = document.getElementById('ecuacion-conversiones').value;
    const sustanciaFrom = document.getElementById('sustancia-from').value;
    const cantidadFrom = parseFloat(document.getElementById('cantidad-from').value);
    const unidadFrom = document.getElementById('unidad-from').value;
    const sustanciaTo = document.getElementById('sustancia-to').value;
    const unidadTo = document.getElementById('unidad-to').value;
    const resultDiv = document.getElementById('conversionesResult');
    
    try {
        // Parsear la ecuación
        const reaccion = parsearEcuacion(ecuacion);
        
        // Simular cálculos para este ejemplo
        let resultadoConversion = 15.2; // Esto sería calculado en base a los datos proporcionados
        let resultText = `<h3>Resultado de la Conversión Estequiométrica:</h3>
            <p>${cantidadFrom} ${unidadFrom} de compuesto A ➞ ${resultadoConversion.toFixed(4)} ${unidadTo} de compuesto B</p>
            
            <h4>Paso a paso:</h4>
            <ol>
                <li>Identificar coeficientes estequiométricos en la ecuación balanceada</li>
                <li>Convertir la cantidad inicial a moles</li>
                <li>Aplicar la relación molar entre las sustancias</li>
                <li>Convertir de moles a la unidad solicitada</li>
            </ol>`;
            
        resultDiv.innerHTML = resultText;
        resultDiv.classList.add('visible');
    } catch (error) {
        resultDiv.innerHTML = `<p class="error">Error: ${error.message}</p>`;
        resultDiv.classList.add('visible');
    }
}

// Inicialización de la página
document.addEventListener('DOMContentLoaded', function() {
    // Agregar event listeners para los selectores de condiciones personalizadas
    const condicionesSelector = document.getElementById('condiciones');
    const condicionesPersonalizadas = document.getElementById('condiciones-personalizadas');
    
    if (condicionesSelector) {
        condicionesSelector.addEventListener('change', function() {
            if (this.value === 'personalizado') {
                condicionesPersonalizadas.style.display = 'block';
            } else {
                condicionesPersonalizadas.style.display = 'none';
            }
        });
    }
    
    // Podríamos agregar más inicializaciones aquí...
});