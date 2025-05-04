# --- Build Stage ---
    FROM public.ecr.aws/docker/library/node:20.9.0-slim AS builder

    WORKDIR /app
    
    # Copy package files and app source
    COPY package.json package-lock.json ./
    COPY apps/webpack-app ./apps/webpack-app
    
    # Install only prod deps to build
    RUN npm ci
    
    # Build the Next.js app (output: standalone)
    WORKDIR /app/apps/webpack-app
    RUN npm run build
    
    # --- Runner Stage ---
    FROM public.ecr.aws/docker/library/node:20.9.0-slim AS runner
    
    # Lambda Web Adapter
    COPY --from=public.ecr.aws/awsguru/aws-lambda-adapter:0.7.2 /lambda-adapter /opt/extensions/lambda-adapter
    
    ENV PORT=3000
    ENV NODE_ENV=production
    ENV AWS_LWA_ENABLE_COMPRESSION=true
    
    WORKDIR /app
    
    # Copy necessary build artifacts
    COPY --from=builder /app/apps/webpack-app/public ./public
    COPY --from=builder /app/apps/webpack-app/package.json ./package.json
    COPY --from=builder /app/apps/webpack-app/.next/standalone ./
    COPY --from=builder /app/apps/webpack-app/.next/static ./.next/static
    COPY --from=builder /app/apps/webpack-app/run.sh ./run.sh
    
    # Optional cache symlink
    RUN ln -s /tmp/cache ./.next/cache
    
    RUN chmod +x ./run.sh
    CMD ["./run.sh"]
    