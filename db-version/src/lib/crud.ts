import { NextResponse } from "next/server";
import type { Model } from "mongoose";
import { connectDB } from "./mongodb";
import { ensureSeeded } from "./seed";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface CrudOpts {
  /** field ที่ต้องไม่ซ้ำ (เช่น PO_NO, CODE) — ใช้ตรวจตอน create/update */
  unique?: string;
  /** การ sort ตอน list เช่น { PO_NO: 1 } */
  sort?: Record<string, 1 | -1>;
}

type ItemCtx = { params: Promise<{ id: string }> };

const fail = (err: unknown, status: number) =>
  NextResponse.json(
    { error: err instanceof Error ? err.message : "Unknown error" },
    { status }
  );

/**
 * สร้าง handler ระดับ collection: GET (list) + POST (create)
 */
export function collectionRoute(model: Model<any>, opts: CrudOpts = {}) {
  async function GET() {
    try {
      await connectDB();
      await ensureSeeded();
      const items = await model.find().sort(opts.sort ?? {}).lean();
      return NextResponse.json(items, { status: 200 });
    } catch (err) {
      return fail(err, 502);
    }
  }

  async function POST(req: Request) {
    try {
      await connectDB();
      const body = await req.json();
      delete body._id;
      delete body.createdAt;
      delete body.updatedAt;

      if (opts.unique) {
        const val = body[opts.unique];
        if (!val) {
          return NextResponse.json(
            { error: `ต้องระบุ ${opts.unique}` },
            { status: 400 }
          );
        }
        const exists = await model.findOne({ [opts.unique]: val }).lean();
        if (exists) {
          return NextResponse.json(
            { error: `${opts.unique} "${val}" มีอยู่แล้ว` },
            { status: 409 }
          );
        }
      }

      const created = await model.create(body);
      return NextResponse.json(created, { status: 201 });
    } catch (err) {
      return fail(err, 500);
    }
  }

  return { GET, POST };
}

/**
 * สร้าง handler ระดับ item: GET (one) + PUT (update) + DELETE
 */
export function itemRoute(model: Model<any>, opts: CrudOpts = {}) {
  async function GET(_req: Request, { params }: ItemCtx) {
    try {
      await connectDB();
      const { id } = await params;
      const item = await model.findById(id).lean();
      if (!item) return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
      return NextResponse.json(item, { status: 200 });
    } catch (err) {
      return fail(err, 500);
    }
  }

  async function PUT(req: Request, { params }: ItemCtx) {
    try {
      await connectDB();
      const { id } = await params;
      const body = await req.json();
      delete body._id;
      delete body.createdAt;
      delete body.updatedAt;

      // กันแก้ค่า unique ไปชนกับเอกสารอื่น
      if (opts.unique && body[opts.unique] !== undefined) {
        const clash = await model
          .findOne({ [opts.unique]: body[opts.unique], _id: { $ne: id } })
          .lean();
        if (clash) {
          return NextResponse.json(
            { error: `${opts.unique} "${body[opts.unique]}" มีอยู่แล้ว` },
            { status: 409 }
          );
        }
      }

      const updated = await model
        .findByIdAndUpdate(id, body, { new: true, runValidators: true })
        .lean();
      if (!updated) return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
      return NextResponse.json(updated, { status: 200 });
    } catch (err) {
      return fail(err, 500);
    }
  }

  async function DELETE(_req: Request, { params }: ItemCtx) {
    try {
      await connectDB();
      const { id } = await params;
      const deleted = await model.findByIdAndDelete(id).lean();
      if (!deleted) return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
      return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err) {
      return fail(err, 500);
    }
  }

  return { GET, PUT, DELETE };
}
