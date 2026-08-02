// digits — только «локальная» часть номера без кода страны, максимум 10 цифр (999 123 45 67)
export function formatPhoneDigits(digits: string): string {
  let result = "+7";
  if (digits.length > 0) result += ` (${digits.slice(0, 3)}`;
  if (digits.length >= 3) result += ")";
  if (digits.length > 3) result += ` ${digits.slice(3, 6)}`;
  if (digits.length > 6) result += `-${digits.slice(6, 8)}`;
  if (digits.length > 8) result += `-${digits.slice(8, 10)}`;
  return result;
}

export function parsePhoneInput(value: string, currentDigits: string): string {
  let raw = value.replace(/\D/g, "");
  // отображаемое значение всегда начинается с фиксированного "+7" — убираем его "7" из разбора
  raw = raw.slice(1);
  // если первая набранная цифра — ещё один избыточный код страны (7/8), тоже игнорируем её
  if (currentDigits === "" && (raw[0] === "7" || raw[0] === "8")) {
    raw = raw.slice(1);
  }
  return raw.slice(0, 10);
}
