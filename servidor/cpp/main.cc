#include <napi.h>

#include "ponderaciones.h"

Ponderacion obtenerPonderacion(Napi::Env& env, const Napi::Object& ponderacionJS) {
  auto nem = ponderacionJS.Get("nem").As<Napi::Number>().DoubleValue();
  auto ranking = ponderacionJS.Get("ranking").As<Napi::Number>().DoubleValue();
  auto matematica = ponderacionJS.Get("matematica").As<Napi::Number>().DoubleValue();
  auto lenguaje = ponderacionJS.Get("lenguaje").As<Napi::Number>().DoubleValue();
  auto ciencias_historia = ponderacionJS.Get("ciencias_historia").As<Napi::Number>().DoubleValue();
  return Ponderacion{nem, ranking, matematica, lenguaje, ciencias_historia};
}

Carreras obtenerCarreras(Napi::Env& env, const Napi::Array& carrerasJS) {
  Carreras carreras;

  for (size_t i = 0; i < carrerasJS.Length(); i++) {
    Napi::Value carreraJS = carrerasJS[i];
    Napi::Object carreraJSO = carreraJS.ToObject();
    auto ponderacion = obtenerPonderacion(env, carreraJSO.Get("ponderaciones").ToObject());
    auto vacantes = carreraJSO.Get("vacantes").As<Napi::Number>().Int32Value();
    carreras.emplace_back(ponderacion, vacantes);
  }

  return carreras;
}

Napi::Array crearSeleccionadosJS(Napi::Env& env, const Postulantes& seleccionados) {
  auto seleccionadosJS = Napi::Array::New(env, seleccionados.size());

  for (size_t i = 0; i < seleccionados.size(); i++) {
    auto seleccionadoJS = Napi::Object::New(env);
    seleccionadoJS.Set("rut", seleccionados[i].rut);
    seleccionadoJS.Set("ponderacion", seleccionados[i].ponderacion);
    seleccionadosJS[i] = seleccionadoJS;
  }
  return seleccionadosJS;
}

void setSeleccionados(Napi::Env& env, Napi::Array& carrerasJS, const Carreras& carreras) {
  for (size_t i = 0; i < carrerasJS.Length(); i++) {
    Napi::Value carreraJS = carrerasJS[i];
    Napi::Object carreraJSO = carreraJS.ToObject();
    carreraJSO.Set("seleccionados", crearSeleccionadosJS(env, carreras[i].estado.seleccionados));
  }
}

Napi::Value Ponderacion(const Napi::CallbackInfo& info) {
  Napi::Env env = info.Env();
  if (info.Length() < 2) {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return env.Null();
  }
  std::string csv = info[0].As<Napi::String>();

  auto carrerasJS = info[1].As<Napi::Array>();

  auto carreras = obtenerCarreras(env, carrerasJS);

  ponderaciones(csv, carreras);

  setSeleccionados(env, carrerasJS, carreras);

  return env.Null();
  return Napi::Number::New(env, carreras[1].estado.seleccionados.size());
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "ponderacion"), Napi::Function::New(env, Ponderacion));
  return exports;
}

NODE_API_MODULE(addon, Init)