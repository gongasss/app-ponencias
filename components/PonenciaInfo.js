import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';

const PonenciaInfo = ({ ponencia, onBack }) => {
    return (
        <View style={styles.container}>
            <View style={styles.infoContainer}>
                {/* Usamos las propiedades del objeto ponencia */}
                <Text style={styles.title}>{ponencia.title}</Text>

                <Text style={styles.label}>Hora:</Text>
                <Text style={styles.value}>{ponencia.dateTime}</Text>

                <Text style={styles.label}>Sala:</Text>
                <Text style={styles.value}>{ponencia.location}</Text>

                {/* Volver al listado de ponencias */}
                <TouchableOpacity style={styles.button} onPress={onBack}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f9f9f9',
    },
    infoContainer: {
        backgroundColor: '#ffffff',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
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
    button: {
        backgroundColor: '#3498db',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default PonenciaInfo;
