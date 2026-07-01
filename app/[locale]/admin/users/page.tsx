import { listUsersAction } from "@/lib/admin/actions";
import { RoleSelect } from "@/components/admin/role-select";

export default async function AdminUsersPage() {
  const users = await listUsersAction();

  return (
    <div>
      <h1 className="text-xl font-bold mb-1">用户管理</h1>
      <p className="text-sm text-neutral-500 mb-6">
        最近 200 名用户。可调整角色（学生 / 导师 / 管理员）。
      </p>

      <div className="overflow-x-auto rounded-xl border border-neutral-200">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">账号</th>
              <th className="px-4 py-2 font-medium">注册日期</th>
              <th className="px-4 py-2 font-medium">档案</th>
              <th className="px-4 py-2 font-medium">申请数</th>
              <th className="px-4 py-2 font-medium">角色</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-neutral-100">
                <td className="px-4 py-2">
                  <span className="text-neutral-800">
                    {u.email || u.phone || "—"}
                  </span>
                  {u.email && u.phone && (
                    <span className="text-neutral-400 text-xs block">
                      {u.phone}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2 text-neutral-500">{u.createdAt}</td>
                <td className="px-4 py-2 text-neutral-500">
                  {u.hasProfile ? "已建档" : "—"}
                </td>
                <td className="px-4 py-2 text-neutral-500">{u.applications}</td>
                <td className="px-4 py-2">
                  <RoleSelect userId={u.id} role={u.role} />
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-neutral-400">
                  暂无用户
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
