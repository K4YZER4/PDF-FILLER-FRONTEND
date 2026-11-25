/** Canvas de firma con soporte para dibujo táctil y mouse.
 *
 *  Usa la librería signature_pad para capturar la firma del cliente.
 *  Expone el método toDataURL() mediante una ref para que el padre
 *  pueda obtener la imagen base64 al enviar.
 *
 *  Uso:
 *    const ref = useRef<SignatureCanvasRef>(null)
 *    <SignatureCanvas ref={ref} />
 *    const dataUrl = ref.current?.toDataURL() */
import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import SignaturePad from "signature_pad";

export interface SignatureCanvasRef {
  toDataURL: () => string | null;
  isEmpty: () => boolean;
  clear: () => void;
}

const SignatureCanvas = forwardRef<SignatureCanvasRef>((_props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const padRef = useRef<SignaturePad | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const data = padRef.current?.toData() ?? [];
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      padRef.current?.clear();
      if (data.length > 0) padRef.current?.fromData(data);
    };

    padRef.current = new SignaturePad(canvas, {
      penColor: "#1e3a5f",
      minWidth: 1,
      maxWidth: 3,
    });

    resize();
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("resize", resize);
      padRef.current?.off();
    };
  }, []);

  useImperativeHandle(ref, () => ({
    toDataURL: () => padRef.current?.toDataURL("image/png") ?? null,
    isEmpty: () => padRef.current?.isEmpty() ?? true,
    clear: () => padRef.current?.clear(),
  }));

  return (
    <div className="border-2 border-border rounded-xl overflow-hidden bg-white">
      <canvas
        ref={canvasRef}
        className="w-full h-40 touch-none"
        style={{ cursor: "crosshair" }}
      />
    </div>
  );
});

SignatureCanvas.displayName = "SignatureCanvas";

export { SignatureCanvas };
