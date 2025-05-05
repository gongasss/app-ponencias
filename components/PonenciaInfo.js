import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

// Función utilitaria para determinar si el color es claro
const esColorClaro = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const luminancia = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminancia > 0.7;
};

const PonenciaInfo = ({ ponencia }) => {
    const color = ponencia.Color || '#3498db'; // El color ahora se llama "Color"
    const textoOscuro = esColorClaro(color);

    return (
        <View style={styles.cardContainer}>
            <View style={[styles.colorBar, { backgroundColor: color }]} />
            <View style={styles.infoContainer}>
                <Text style={[styles.title, textoOscuro && styles.darkText]}>
                    {ponencia.Title} {/* Ahora el título se llama "Title" */}
                </Text>

                <Text style={[styles.label, textoOscuro && styles.darkText]}>Fecha de Inicio:</Text>
                <Text style={[styles.value, textoOscuro && styles.darkText]}>
                    {new Date(ponencia.FechaInicio).toLocaleString()} {/* Fecha de inicio ahora se llama "FechaInicio" */}
                </Text>

                <Text style={[styles.label, textoOscuro && styles.darkText]}>Fecha de Fin:</Text>
                <Text style={[styles.value, textoOscuro && styles.darkText]}>
                    {new Date(ponencia.FechaFin).toLocaleString()} {/* Fecha de fin ahora se llama "FechaFin" */}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        marginBottom: 20,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    colorBar: {
        height: 8,
        width: '100%',
    },
    infoContainer: {
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#3498db',
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
        color: '#333',
    },
    value: {
        fontSize: 16,
        marginBottom: 10,
        color: '#555',
    },
    darkText: {
        color: '#222',
    },
});

export default PonenciaInfo;
