
create policy "media public read" on storage.objects for select to anon, authenticated using (bucket_id = 'media');
create policy "media auth upload" on storage.objects for insert to authenticated with check (bucket_id = 'media' and owner = auth.uid());
create policy "media owner update" on storage.objects for update to authenticated using (bucket_id = 'media' and owner = auth.uid());
create policy "media owner delete" on storage.objects for delete to authenticated using (bucket_id = 'media' and owner = auth.uid());
create policy "media admin all" on storage.objects for all to authenticated
  using (bucket_id = 'media' and public.has_role(auth.uid(),'admin'))
  with check (bucket_id = 'media' and public.has_role(auth.uid(),'admin'));
