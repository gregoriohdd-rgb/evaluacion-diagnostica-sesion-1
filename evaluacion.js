const Evaluacion = (() => {
    const ARCHIVO = "resultados-sesion-1.json";
    const STORAGE_KEY = "evaluacion-sesion-1-envios-v1";
    const PREGUNTAS = [
        {
            texto: "¿Cuál es la principal diferencia entre la ofimática tradicional y la ofimática moderna en la nube?",
            correcta: "b",
            opciones: {
                a: "La moderna no permite imprimir documentos físicos.",
                b: "La moderna guarda los archivos en servidores de internet, facilitando el acceso desde cualquier lugar y el trabajo colaborativo.",
                c: "La moderna solo funciona en computadoras sin conexión a internet.",
                d: "No existe diferencia, ambas requieren instalación mediante CD."
            }
        },
        {
            texto: "Al utilizar herramientas como Google Drive o OneDrive en tu computadora, ¿qué significa el proceso de 'sincronización'?",
            correcta: "a",
            opciones: {
                a: "Que los archivos de tu disco duro se copian y mantienen actualizados en la nube de forma automática al tener internet.",
                b: "Que el programa elimina los archivos antiguos de tu PC para ahorrar espacio en la nube.",
                c: "Que tu computadora se apaga automáticamente al terminar de subir un archivo.",
                d: "Que los documentos se traducen a otros idiomas sin tu permiso."
            }
        },
        {
            texto: "Si configuras un archivo de tu carpeta de OneDrive o Google Drive como 'Solo en la nube' (Online-only), ¿qué ocurre si intentas abrirlo sin conexión a internet?",
            correcta: "c",
            opciones: {
                a: "Se abre normalmente pero no puedes guardar los cambios.",
                b: "El archivo se borra permanentemente por seguridad.",
                c: "No podrás abrir el archivo hasta que vuelvas a conectarte a internet.",
                d: "El archivo se descarga automáticamente como imagen."
            }
        },
        {
            texto: "¿Cuál de las siguientes opciones es un procesador de textos que permite la coautoría y edición colaborativa en tiempo real?",
            correcta: "b",
            opciones: {
                a: "Microsoft Paint",
                b: "Google Docs",
                c: "Bloc de notas de Windows",
                d: "Calculadora de Windows"
            }
        },
        {
            texto: "Estás redactando un informe en Word o Google Docs y necesitas listar los requisitos de un proyecto. ¿Qué herramienta de formato es la más adecuada?",
            correcta: "b",
            opciones: {
                a: "Resaltado de texto en color amarillo",
                b: "Numeración o Viñetas",
                c: "Aumentar el tamaño de la letra a 24pt",
                d: "Subrayado y texto centrado"
            }
        },
        {
            texto: "Al elaborar un documento, necesitas mostrar un cronograma de actividades organizado en filas y columnas. ¿Qué elemento gráfico debes insertar?",
            correcta: "c",
            opciones: {
                a: "Un gráfico circular o de pastel",
                b: "Un salto de sección",
                c: "Una tabla",
                d: "Un video de YouTube"
            }
        },
        {
            texto: "¿Cuál es la forma más rápida, estructurada y profesional de organizar los títulos y subtítulos de un documento extenso?",
            correcta: "b",
            opciones: {
                a: "Poniendo todo el texto en mayúsculas y negrita manualmente.",
                b: "Utilizando la herramienta de 'Estilos' predeterminados (Título 1, Título 2, etc.).",
                c: "Cambiando el tipo de fuente y color al azar en cada página.",
                d: "Centrando el texto usando repetidamente la barra espaciadora."
            }
        },
        {
            texto: "¿Cuál de los siguientes es un ejemplo de un asistente de Inteligencia Artificial que puede ayudarte a generar el borrador de un oficio o informe?",
            correcta: "a",
            opciones: {
                a: "Gemini o ChatGPT",
                b: "Papelera de reciclaje",
                c: "OneDrive",
                d: "Panel de Control"
            }
        },
        {
            texto: "Le has pedido a una Inteligencia Artificial que redacte un memorando formal para tu equipo. ¿Cuál es la mejor práctica antes de enviarlo o imprimirlo?",
            correcta: "b",
            opciones: {
                a: "Copiar y pegar el texto tal cual, ya que la IA es infalible.",
                b: "Revisar, adaptar el tono a la institución y verificar que los datos inventados por la IA sean corregidos o confirmados.",
                c: "Eliminar el texto porque la IA no sirve para entornos laborales.",
                d: "Enviar el documento e incluir una nota diciendo que tú no lo escribiste."
            }
        },
        {
            texto: "Para organizar correctamente tus archivos locales y en la nube (como se indica en las buenas prácticas), ¿qué acción es recomendada?",
            correcta: "c",
            opciones: {
                a: "Guardar absolutamente todo en el Escritorio para tenerlo a la mano.",
                b: "Nombrar todos tus archivos como 'Doc1', 'Doc2' o 'Final'.",
                c: "Crear una estructura jerárquica de carpetas y nombrar los archivos usando fechas (ej. 2026-10-28_Reporte).",
                d: "Nunca borrar la carpeta de Descargas."
            }
        }
    ];

    function nivel(puntaje) {
        if (puntaje >= 8) return "Logrado";
        if (puntaje >= 5) return "En proceso";
        return "Inicial";
    }

    function escapar(texto) {
        return String(texto)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");
    }

    function leerLocal() {
        try {
            const datos = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
            return Array.isArray(datos) ? datos : [];
        } catch (error) {
            return [];
        }
    }

    function guardarLocal(envios) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(envios));
    }

    function unir(base, extra) {
        const ids = new Set(base.map((item) => item.id));
        extra.forEach((item) => {
            if (item && item.id && !ids.has(item.id)) {
                base.push(item);
                ids.add(item.id);
            }
        });
        base.sort((a, b) => String(a.fecha).localeCompare(String(b.fecha)));
        return base;
    }

    function archivoDe(envios) {
        return {
            evaluacion: "Evaluación de Entrada - Sesión 1",
            archivo: ARCHIVO,
            actualizado: new Date().toISOString(),
            envios
        };
    }

    function pintarPreguntas(contenedor) {
        contenedor.innerHTML = PREGUNTAS.map((pregunta, indice) => {
            const opciones = Object.entries(pregunta.opciones).map(([letra, texto]) => `
                <li>
                    <label>
                        <input type="radio" name="q${indice}" value="${letra}" required>
                        <span><strong>${letra})</strong> ${escapar(texto)}</span>
                    </label>
                </li>
            `).join("");
            return `
                <fieldset class="question-container">
                    <legend class="question-text">${indice + 1}. ${escapar(pregunta.texto)}</legend>
                    <ul class="options">${opciones}</ul>
                </fieldset>
            `;
        }).join("");
    }

    function htmlPersonal(envio) {
        const clase = envio.puntaje >= 8 ? "" : envio.puntaje >= 5 ? "medio" : "bajo";
        const detalle = envio.respuestas.map((elegida, indice) => {
            const bien = elegida === PREGUNTAS[indice].correcta;
            return `<div class="detalle-item ${bien ? "bien" : "falla"}">${indice + 1}. ${bien ? "Correcta" : "Incorrecta"}</div>`;
        }).join("");
        return {
            clase,
            html: `
                <p class="puntaje">${envio.puntaje} / ${envio.total}</p>
                <p><strong>${escapar(envio.nombre)}</strong> · ${nivel(envio.puntaje)} · ${new Date(envio.fecha).toLocaleString("es")}</p>
                ${detalle}
            `
        };
    }

    function htmlResumen(envios) {
        const total = envios.length;
        const suma = envios.reduce((acum, item) => acum + item.puntaje, 0);
        const promedio = total ? (suma / total).toFixed(1) : "—";
        const logrados = envios.filter((item) => item.puntaje >= 8).length;
        const filas = total ? envios.map((item) => `
            <tr>
                <td>${escapar(item.nombre)}</td>
                <td>${new Date(item.fecha).toLocaleString("es")}</td>
                <td>${item.puntaje} / ${item.total}</td>
                <td>${nivel(item.puntaje)}</td>
                <td><button type="button" class="peligro" data-quitar="${escapar(item.id)}">Quitar</button></td>
            </tr>
        `).join("") : `<tr><td colspan="5">Todavía no hay envíos en este navegador.</td></tr>`;
        const porPregunta = PREGUNTAS.map((pregunta, indice) => {
            const aciertos = envios.filter((item) => item.respuestas[indice] === pregunta.correcta).length;
            const porcentaje = total ? Math.round((aciertos / total) * 100) : 0;
            return `
                <div class="pregunta-resumen">
                    <div>${indice + 1}. ${aciertos} de ${total} aciertos (${porcentaje}%)</div>
                    <div class="bar"><i style="width:${porcentaje}%"></i></div>
                </div>
            `;
        }).join("");
        const clave = PREGUNTAS.map((pregunta, indice) => `
            <div class="detalle-item"><strong>${indice + 1}. ${pregunta.correcta})</strong> ${escapar(pregunta.opciones[pregunta.correcta])}</div>
        `).join("");
        return `
            <div class="metricas">
                <div class="metrica"><span>Participantes</span><strong>${total}</strong></div>
                <div class="metrica"><span>Promedio</span><strong>${promedio}</strong></div>
                <div class="metrica"><span>Logrado (8 o más)</span><strong>${logrados}</strong></div>
            </div>
            <table>
                <thead>
                    <tr><th>Nombre</th><th>Fecha</th><th>Puntaje</th><th>Nivel</th><th></th></tr>
                </thead>
                <tbody>${filas}</tbody>
            </table>
            <h3>Aciertos por pregunta</h3>
            ${porPregunta}
            <div class="clave">
                <h3>Alternativas correctas</h3>
                ${clave}
            </div>
        `;
    }

    return {
        ARCHIVO,
        STORAGE_KEY,
        PREGUNTAS,
        nivel,
        escapar,
        leerLocal,
        guardarLocal,
        unir,
        archivoDe,
        pintarPreguntas,
        htmlPersonal,
        htmlResumen
    };
})();
