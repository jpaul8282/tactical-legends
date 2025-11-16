<script lang="ts">
  import { enhance } from '$app/forms';
  export let form;
</script>

<form
  use:enhance
  action="?/upload"
  method="POST"
  enctype="multipart/form-data"
>
  <input type="file" name="file" required />
  <button>Upload</button>

  {#if form}
    <p>uploaded {form.uploaded}</p>
  {/if}
</form>
src/routes/+page.server.ts
import { error } from "@sveltejs/kit";
import { put } from "@vercel/blob";

export const actions = {
  upload: async ({ request }) => {
    const form = await request.formData();
    const file = form.get("file") as File;

    if (!file) {
      throw error(400, { message: "No file to upload." });
    }

    const { url } = await put(file.name, file, { access: "public" });
    return { uploaded: url };
  },
};
src/routes/+page.ts
export const prerender = false;
