export function sendSuccess(res, { statusCode = 200, message = 'Success', data = null, meta } = {}) {
  const body = { success: true, message};
  if (meta) body.meta = meta;
  if (data) body.data = data;
  return res.status(statusCode).json(body);
}
