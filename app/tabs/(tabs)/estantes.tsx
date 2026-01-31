import React, { useState } from 'react';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Button, ButtonText } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';
import { ScrollView } from '@/components/ui/scroll-view';
import { FormControl, FormControlLabel, FormControlError, FormControlErrorText } from '@/components/ui/form-control';
import {
  Select,
  SelectTrigger,
  SelectInput,
  SelectIcon,
  SelectPortal,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectItem,
  SelectScrollView,
} from '@/components/ui/select';
import { ChevronDownIcon } from '@/components/ui/icon';

interface Establecimiento {
  id: string;
  nombre: string;
  calle: string;
  cp: string;
  colonia: string;
  celular: string;
}

interface Estante {
  id: string;
  establecimientoId: string;
  establecimientoNombre: string;
  seccion: string;
  nivel: number;
  codigo: string; // Ej: A-01, A-02, B-01, etc.
}

export default function Estantes() {
  // En una app real, esto vendría de un contexto o estado global
  const [establecimientos] = useState<Establecimiento[]>([
    {
      id: '1',
      nombre: 'Almacén Central',
      calle: 'Av. Principal 123',
      cp: '12345',
      colonia: 'Centro',
      celular: '5551234567',
    },
  ]);

  const [estantes, setEstantes] = useState<Estante[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    establecimientoId: '',
    seccion: '',
    niveles: '',
  });

  const [errors, setErrors] = useState({
    establecimientoId: '',
    seccion: '',
    niveles: '',
  });

  const validateForm = () => {
    const newErrors = {
      establecimientoId: '',
      seccion: '',
      niveles: '',
    };

    if (!formData.establecimientoId) {
      newErrors.establecimientoId = 'Debe seleccionar un establecimiento';
    }

    if (!formData.seccion.trim()) {
      newErrors.seccion = 'La sección es requerida';
    } else if (!/^[A-Z]$/i.test(formData.seccion.trim())) {
      newErrors.seccion = 'La sección debe ser una sola letra (A, B, C, etc.)';
    }

    if (!formData.niveles.trim()) {
      newErrors.niveles = 'El número de niveles es requerido';
    } else {
      const niveles = parseInt(formData.niveles);
      if (isNaN(niveles) || niveles < 1 || niveles > 99) {
        newErrors.niveles = 'Debe ser un número entre 1 y 99';
      }
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== '');
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const establecimiento = establecimientos.find(
        (e) => e.id === formData.establecimientoId
      );

      if (!establecimiento) return;

      const seccion = formData.seccion.trim().toUpperCase();
      const cantidadNiveles = parseInt(formData.niveles);
      const nuevosEstantes: Estante[] = [];

      // Generar todos los estantes para la sección
      for (let i = 1; i <= cantidadNiveles; i++) {
        const codigo = `${seccion}-${String(i).padStart(2, '0')}`;
        nuevosEstantes.push({
          id: `${Date.now()}-${i}`,
          establecimientoId: establecimiento.id,
          establecimientoNombre: establecimiento.nombre,
          seccion: seccion,
          nivel: i,
          codigo: codigo,
        });
      }

      setEstantes([...estantes, ...nuevosEstantes]);
      setFormData({
        establecimientoId: '',
        seccion: '',
        niveles: '',
      });
      setShowForm(false);
      setErrors({
        establecimientoId: '',
        seccion: '',
        niveles: '',
      });
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setFormData({
      establecimientoId: '',
      seccion: '',
      niveles: '',
    });
    setErrors({
      establecimientoId: '',
      seccion: '',
      niveles: '',
    });
  };

  // Agrupar estantes por establecimiento
  const estantesPorEstablecimiento = estantes.reduce((acc, estante) => {
    if (!acc[estante.establecimientoId]) {
      acc[estante.establecimientoId] = {
        establecimiento: establecimientos.find((e) => e.id === estante.establecimientoId),
        estantes: [],
      };
    }
    acc[estante.establecimientoId].estantes.push(estante);
    return acc;
  }, {} as Record<string, { establecimiento?: Establecimiento; estantes: Estante[] }>);

  return (
    <Box className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <Box className="p-6">
          <Heading className="font-bold text-3xl mb-6 text-gray-900">
            Estantes
          </Heading>

          {establecimientos.length === 0 ? (
            <Box className="bg-yellow-50 border-2 border-yellow-300 p-6 rounded-xl">
              <Text className="text-xl text-yellow-800 text-center font-semibold">
                ⚠️ Primero debe crear un establecimiento
              </Text>
              <Text className="text-lg text-yellow-700 text-center mt-2">
                Vaya a la pestaña "Establecimientos" para crear uno
              </Text>
            </Box>
          ) : !showForm ? (
            <>
              <Box className="mb-6">
                <Button
                  size="xl"
                  action="primary"
                  onPress={() => setShowForm(true)}
                  className="bg-blue-600 py-2"
                >
                  <ButtonText className="text-lg font-semibold">
                    + Agregar Nuevos Estantes
                  </ButtonText>
                </Button>
              </Box>

              {/* Lista de Estantes agrupados por Establecimiento */}
              {estantes.length === 0 ? (
                <Box className="mt-8 items-center bg-white p-8 rounded-xl border-2 border-gray-200">
                  <Text className="text-xl text-gray-600 text-center">
                    No hay estantes registrados
                  </Text>
                  <Text className="text-lg text-gray-500 text-center mt-2">
                    Presiona el botón de arriba para agregar estantes
                  </Text>
                </Box>
              ) : (
                <VStack space="xl">
                  {Object.values(estantesPorEstablecimiento).map((grupo) => (
                    <Box key={grupo.establecimiento?.id} className="mb-6">
                      <Box className="bg-blue-100 p-4 rounded-t-xl border-2 border-blue-300">
                        <Text className="text-2xl font-bold text-blue-900">
                          {grupo.establecimiento?.nombre}
                        </Text>
                      </Box>

                      {/* Agrupar estantes por sección */}
                      {Object.entries(
                        grupo.estantes.reduce((acc, estante) => {
                          if (!acc[estante.seccion]) {
                            acc[estante.seccion] = [];
                          }
                          acc[estante.seccion].push(estante);
                          return acc;
                        }, {} as Record<string, Estante[]>)
                      ).map(([seccion, estantesSeccion]) => (
                        <Box
                          key={seccion}
                          className="bg-white border-2 border-blue-300 border-t-0 rounded-b-xl p-4"
                        >
                          <Text className="text-xl font-semibold text-gray-700 mb-3">
                            Sección {seccion}
                          </Text>
                          <Box className="flex-row flex-wrap gap-2">
                            {estantesSeccion
                              .sort((a, b) => a.nivel - b.nivel)
                              .map((estante) => (
                                <Box
                                  key={estante.id}
                                  className="bg-gray-100 border-2 border-gray-300 px-4 py-3 rounded-lg min-w-[80px] items-center"
                                >
                                  <Text className="text-xl font-bold text-gray-900">
                                    {estante.codigo}
                                  </Text>
                                </Box>
                              ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ))}
                </VStack>
              )}
            </>
          ) : (
            <Box className="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-md">
              <Heading className="font-bold text-2xl mb-6 text-gray-900">
                Nuevos Estantes
              </Heading>
              <Text className="text-lg text-gray-600 mb-6">
                Complete los campos para crear estantes automáticamente. Se generarán todos los niveles de la sección.
              </Text>

              <VStack space="xl">
                {/* Selector de Establecimiento */}
                <FormControl isInvalid={!!errors.establecimientoId}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Establecimiento (Almacén)
                    </Text>
                  </FormControlLabel>
                  <Select
                    selectedValue={formData.establecimientoId}
                    onValueChange={(value) => {
                      setFormData({ ...formData, establecimientoId: value });
                      if (errors.establecimientoId) {
                        setErrors({ ...errors, establecimientoId: '' });
                      }
                    }}
                  >
                    <SelectTrigger
                      variant="outline"
                      size="xl"
                      className={`rounded-xl border-2 ${
                        errors.establecimientoId
                          ? 'border-red-500'
                          : 'border-gray-400'
                      }`}
                    >
                      <SelectInput
                        placeholder="Seleccione un establecimiento"
                        className="text-xl py-3"
                      />
                      <SelectIcon className="mr-3">
                        <ChevronDownIcon />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectPortal>
                      <SelectBackdrop />
                      <SelectContent>
                        <SelectDragIndicatorWrapper>
                          <SelectDragIndicator />
                        </SelectDragIndicatorWrapper>
                        <SelectScrollView>
                          {establecimientos.map((establecimiento) => (
                            <SelectItem
                              key={establecimiento.id}
                              label={establecimiento.nombre}
                              value={establecimiento.id}
                            />
                          ))}
                        </SelectScrollView>
                      </SelectContent>
                    </SelectPortal>
                  </Select>
                  {errors.establecimientoId && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.establecimientoId}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                </FormControl>

                {/* Sección */}
                <FormControl isInvalid={!!errors.seccion}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Sección
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.seccion ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: A, B, C"
                      value={formData.seccion}
                      onChangeText={(text) => {
                        const upperText = text.toUpperCase().replace(/[^A-Z]/g, '');
                        setFormData({ ...formData, seccion: upperText });
                        if (errors.seccion) {
                          setErrors({ ...errors, seccion: '' });
                        }
                      }}
                      maxLength={1}
                      className="text-xl py-3 text-center"
                      autoCapitalize="characters"
                    />
                  </Input>
                  {errors.seccion && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.seccion}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                  <Text className="text-base text-gray-500 mt-1">
                    Ingrese una sola letra (A, B, C, D, etc.)
                  </Text>
                </FormControl>

                {/* Niveles */}
                <FormControl isInvalid={!!errors.niveles}>
                  <FormControlLabel>
                    <Text className="text-xl font-semibold text-gray-900 mb-2">
                      Cantidad de Niveles
                    </Text>
                  </FormControlLabel>
                  <Input
                    variant="outline"
                    size="xl"
                    className={`rounded-xl border-2 ${
                      errors.niveles ? 'border-red-500' : 'border-gray-400'
                    }`}
                  >
                    <InputField
                      placeholder="Ejemplo: 5"
                      value={formData.niveles}
                      onChangeText={(text) => {
                        setFormData({
                          ...formData,
                          niveles: text.replace(/\D/g, ''),
                        });
                        if (errors.niveles) {
                          setErrors({ ...errors, niveles: '' });
                        }
                      }}
                      keyboardType="numeric"
                      maxLength={2}
                      className="text-xl py-3 text-center"
                    />
                  </Input>
                  {errors.niveles && (
                    <FormControlError>
                      <FormControlErrorText className="text-lg">
                        {errors.niveles}
                      </FormControlErrorText>
                    </FormControlError>
                  )}
                  <Text className="text-base text-gray-500 mt-1">
                    Se crearán estantes desde {formData.seccion || 'X'}-01 hasta{' '}
                    {formData.seccion || 'X'}-
                    {formData.niveles ? String(formData.niveles).padStart(2, '0') : 'XX'}
                  </Text>
                </FormControl>

                {/* Vista previa */}
                {formData.seccion &&
                  formData.niveles &&
                  !errors.seccion &&
                  !errors.niveles && (
                    <Box className="bg-blue-50 border-2 border-blue-300 p-4 rounded-xl">
                      <Text className="text-lg font-semibold text-blue-900 mb-2">
                        Se crearán los siguientes estantes:
                      </Text>
                      <Box className="flex-row flex-wrap gap-2">
                        {Array.from(
                          { length: parseInt(formData.niveles) },
                          (_, i) => i + 1
                        ).map((nivel) => (
                          <Box
                            key={nivel}
                            className="bg-white border border-blue-400 px-3 py-2 rounded"
                          >
                            <Text className="text-lg font-bold text-blue-900">
                              {formData.seccion.toUpperCase()}-
                              {String(nivel).padStart(2, '0')}
                            </Text>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}

                {/* Botones */}
                <VStack space="md" className="mt-6">
                  <Button
                    size="xl"
                    action="primary"
                    onPress={handleSubmit}
                    className="bg-blue-600 py-2"
                  >
                    <ButtonText className="text-xl font-semibold">
                      Crear Estantes
                    </ButtonText>
                  </Button>
                  <Button
                    size="xl"
                    action="secondary"
                    variant="outline"
                    onPress={handleCancel}
                    className="border-2 border-gray-400 py-2"
                  >
                    <ButtonText className="text-xl font-semibold text-gray-700">
                      Cancelar
                    </ButtonText>
                  </Button>
                </VStack>
              </VStack>
            </Box>
          )}
        </Box>
      </ScrollView>
    </Box>
  );
}
