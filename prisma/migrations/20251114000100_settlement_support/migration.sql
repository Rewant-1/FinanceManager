-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "settlementId" TEXT;

-- CreateTable
CREATE TABLE "Settlement" (
    "id" TEXT NOT NULL,
    "partnerLinkId" TEXT NOT NULL,
    "settledById" TEXT NOT NULL,
    "balanceSnapshot" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Settlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Transaction_settlementId_idx" ON "Transaction"("settlementId");
CREATE INDEX "Settlement_partnerLinkId_idx" ON "Settlement"("partnerLinkId");
CREATE INDEX "Settlement_settledById_idx" ON "Settlement"("settledById");

-- AddForeignKey
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_partnerLinkId_fkey" FOREIGN KEY ("partnerLinkId") REFERENCES "PartnerLink"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Settlement" ADD CONSTRAINT "Settlement_settledById_fkey" FOREIGN KEY ("settledById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_settlementId_fkey" FOREIGN KEY ("settlementId") REFERENCES "Settlement"("id") ON DELETE SET NULL ON UPDATE CASCADE;
