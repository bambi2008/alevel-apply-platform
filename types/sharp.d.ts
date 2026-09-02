declare module "sharp" {
  type SharpInstance = {
    rotate(): SharpInstance;
    flatten(options: { background: string }): SharpInstance;
    resize(options: {
      width: number;
      height: number;
      fit: "inside";
      withoutEnlargement: boolean;
    }): SharpInstance;
    jpeg(options: { quality: number; chromaSubsampling: string }): SharpInstance;
    toBuffer(options: { resolveWithObject: true }): Promise<{
      data: Buffer;
      info: { width: number; height: number };
    }>;
  };

  type SharpFactory = (
    input: Buffer,
    options?: { failOn?: "warning"; limitInputPixels?: number },
  ) => SharpInstance;

  const sharp: SharpFactory;
  export default sharp;
}
