import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';
import { Camera } from 'expo-camera';

import * as MediaLibrary from 'expo-media-library';


const CameraScreen = () => {
    const [permissao, setPermissao] = useState(null)

    const [cameraVisivel, setCameraVisivel] = useState(false)
    const [tipoCamera, setTipoCamera] = useState(Camera.Constants.Type.back)
    const [previewVisivel, setPreviewVisivel] = useState(false)

    const [imagemCapturada, setImagemCapturada] = useState(null)
    const [flashAtivado, setFlashAtivado] = useState('on')

    const cameraRef = useRef(null)

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setPermissao(status === 'granted');
        })();
    }, []);

    const abrirCamera = async () => {
        setCameraVisivel(true)
    }

    const ativarFlash = () => {
        if (flashAtivado === 'on') {
            setFlashAtivado('off')
        } else if (flashAtivado === 'off') {
            setFlashAtivado('on')
        } else {
            setFlashAtivado('auto')
        }
    }

    const alterarCamera = () => {
        if (tipoCamera === 'back') {
            setTipoCamera('front')
        } else {
            setTipoCamera('back')
        }
    }

    const tirarFoto = async () => {
        try {
            if (cameraRef.current) {
                const foto = await cameraRef.current.takePictureAsync();
                setPreviewVisivel(true);
                setImagemCapturada(foto);
            }
        }
        catch (error) {

            console.log(error);
        }
    }

    const tirarOutraFoto = async () => {
        setImagemCapturada(null)
        setPreviewVisivel(false)
        abrirCamera()
    }

    const salvarFoto = async () => {
        try {
            MediaLibrary.requestPermissionsAsync()
            const arquivo = await MediaLibrary.createAssetAsync(imagemCapturada.uri);
            MediaLibrary.createAlbumAsync('ExpoCamera', arquivo)
                .then(() => {
                    console.log('Foto salva!');
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <View style={styles.container}>
            {
                !cameraVisivel ? (
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => abrirCamera()}
                    >
                        <Text>Abrir Câmera</Text>
                    </TouchableOpacity>
                ) :
                (
                  !imagemCapturada && !previewVisivel?
                  (
                    <Camera style={styles.camera} 
                       type={tipoCamera}
                       flashMode={flashAtivado}
                       ref={cameraRef}
                    >
                        <View 
                         style={{
                            flex:1,
                            with:'100%',
                            backgroundColor: 'transparent',
                            flexDirection:'row'
                         }}>
                            <View
                                style={{
                                    position: 'absolute',
                                    left: '5%',
                                    top: '10%',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableOpacity 
                                    style={{
                                            borderRadius: 50,
                                            height: 25,
                                            width: 25,
                                            backgroundColor: flashAtivado==='off'?'#000':'#FFF'
                                        }}
                                        onPress={ativarFlash}
                                    >
                                            <Text style={{fontSize:20}}>
                                             ⚡
                                            </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity 
                                        onPress={alterarCamera}
                                        style={{
                                            marginTop: 20,
                                            borderRadius: 50,
                                            height: 25,
                                            width: 25,
                                        }}>
                                            <Text style={{fontSize:20}}>
                                            🔄
                                            </Text>
                                    </TouchableOpacity>
                            </View>

                            <View style={styles.viewBtnFoto}>
                                <View
                                style={{
                                    alignSelf: 'center',
                                    flex:1,
                                    alignItems:'center'    
                                }}
                                >
                                    <TouchableOpacity
                                    onPress={tirarFoto}
                                    style={styles.botaoFoto}
                                    />
                                </View>
                            </View>
                         </View>
                    </Camera>
                  ):
                  (
                    <View 
                    style={{
                        backgroundColor: 'transparent',
                        flex:1,
                        width: '100%',
                        height: '100%'
                    }}
                    >
                        <ImageBackground
                            source={{uri:imagemCapturada && imagemCapturada.uri}}
                            style={{
                                flex:1
                            }}>

                                <View
                                style={{
                                    flex:1,
                                    flexDirection:'column',
                                    padding:15,
                                    justifyContent: 'flex-end'
                                }}>
                                    <View
                                     style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                     }}
                                     >
                                        <TouchableOpacity
                                          onPress={tirarOutraFoto}
                                          style={{
                                            width: 130,
                                            height: 40,
                                            alignItems:'center'
                                          }}
                                          >
                                            <Text>Tirar outra </Text>
                                          </TouchableOpacity>

                                          <TouchableOpacity
                                          onPress={salvarFoto}
                                          style={{
                                            width: 130,
                                            height: 40,
                                            alignItems:'center'
                                          }}
                                          >
                                            <Text> Salvar</Text>
                                          </TouchableOpacity>

                                     </View>
                                </View>

                        </ImageBackground>

                    </View>

                  )
                )
            }
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#5f9ea0',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    camera: {
        flex: 1,
        width: '100%',
    },


    viewBtnFoto: {
        position: 'absolute',
        bottom: 10,
        flexDirection: 'row',
        flex: 1,
        width: '100%',
        padding: 20,
        justifyContent: 'space-between'
    },

    botaoFoto: {

        width: 70,
        height: 70,
        bottom: 0,
        borderRadius: 50,
        backgroundColor: '#fff'
    }
});

export default CameraScreen